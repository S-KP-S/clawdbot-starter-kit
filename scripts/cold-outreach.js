/**
 * Cold Email Outreach System
 * 
 * Features:
 * - Email validation (MX record check)
 * - Personalized templates with variables
 * - Rate limiting to avoid spam triggers
 * - Send tracking with logs
 * - Follow-up sequences
 * 
 * Usage:
 *   node cold-outreach.js send leads.json template.txt
 *   node cold-outreach.js validate leads.json
 *   node cold-outreach.js status
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const fs = require('fs').promises;
const path = require('path');

// Config
const SEND_DELAY_MS = 30000; // 30 seconds between emails
const MAX_SENDS_PER_HOUR = 30;
const LOG_FILE = path.join(__dirname, '..', 'tmp', 'outreach-log.json');
const VALID_CACHE_FILE = path.join(__dirname, '..', 'tmp', 'email-validation-cache.json');

// Transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')
  }
});

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

async function validateEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, reason: 'Invalid format' };
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid format' };
  }
  
  // Extract domain
  const domain = email.split('@')[1].toLowerCase();
  
  // Skip common typos
  const typoPatterns = ['gmial', 'gnail', 'gmal', 'gmali', 'yahooo', 'hotmal'];
  if (typoPatterns.some(typo => domain.includes(typo))) {
    return { valid: false, reason: 'Likely typo in domain' };
  }
  
  try {
    // Check MX records
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: 'No MX records' };
    }
    return { valid: true, mx: mxRecords[0].exchange };
  } catch (err) {
    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
      return { valid: false, reason: 'Domain not found' };
    }
    return { valid: false, reason: `DNS error: ${err.code}` };
  }
}

async function validateLeads(leads) {
  const results = { valid: [], invalid: [] };
  let cache = {};
  
  // Load cache
  try {
    const cacheData = await fs.readFile(VALID_CACHE_FILE, 'utf8');
    cache = JSON.parse(cacheData);
  } catch (e) { /* no cache */ }
  
  console.log(`\nValidating ${leads.length} emails...\n`);
  
  for (const lead of leads) {
    const email = lead.email?.toLowerCase().trim();
    if (!email) {
      results.invalid.push({ ...lead, reason: 'No email' });
      continue;
    }
    
    // Check cache first
    if (cache[email]) {
      if (cache[email].valid) {
        results.valid.push(lead);
      } else {
        results.invalid.push({ ...lead, reason: cache[email].reason });
      }
      process.stdout.write(cache[email].valid ? '✓' : '✗');
      continue;
    }
    
    // Validate
    const result = await validateEmail(email);
    cache[email] = result;
    
    if (result.valid) {
      results.valid.push(lead);
      process.stdout.write('✓');
    } else {
      results.invalid.push({ ...lead, reason: result.reason });
      process.stdout.write('✗');
    }
    
    // Small delay to avoid rate limiting
    await sleep(100);
  }
  
  // Save cache
  await fs.mkdir(path.dirname(VALID_CACHE_FILE), { recursive: true });
  await fs.writeFile(VALID_CACHE_FILE, JSON.stringify(cache, null, 2));
  
  console.log(`\n\n✓ Valid: ${results.valid.length}`);
  console.log(`✗ Invalid: ${results.invalid.length}`);
  
  if (results.invalid.length > 0) {
    console.log('\nInvalid emails:');
    results.invalid.slice(0, 10).forEach(l => {
      console.log(`  - ${l.email}: ${l.reason}`);
    });
    if (results.invalid.length > 10) {
      console.log(`  ... and ${results.invalid.length - 10} more`);
    }
  }
  
  return results;
}

// ============================================================================
// TEMPLATE PERSONALIZATION
// ============================================================================

function personalizeTemplate(template, lead) {
  let result = template;
  
  // Available variables
  const vars = {
    name: lead.name || lead.contact_name || 'there',
    first_name: getFirstName(lead.name || lead.contact_name),
    company: lead.company || lead.business_name || 'your company',
    industry: lead.industry || 'your industry',
    city: lead.city || lead.location || '',
    phone: lead.phone || '',
    email: lead.email,
    // Custom fields
    ...lead
  };
  
  // Replace all {{variable}} patterns
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'gi');
    result = result.replace(regex, value || '');
  }
  
  // Clean up any remaining unreplaced variables
  result = result.replace(/{{[^}]+}}/g, '');
  
  return result.trim();
}

function getFirstName(fullName) {
  if (!fullName) return 'there';
  return fullName.split(' ')[0];
}

// ============================================================================
// SENDING
// ============================================================================

async function loadLog() {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { sent: [], bounced: [], replied: [] };
  }
}

async function saveLog(log) {
  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fs.writeFile(LOG_FILE, JSON.stringify(log, null, 2));
}

async function sendCampaign(leads, templatePath, options = {}) {
  const { subject = 'Quick question about {{company}}', dryRun = false } = options;
  
  // Load template
  let template;
  try {
    template = await fs.readFile(templatePath, 'utf8');
  } catch (e) {
    console.error(`Could not read template: ${templatePath}`);
    return;
  }
  
  // Load send log
  const log = await loadLog();
  const alreadySent = new Set(log.sent.map(s => s.email.toLowerCase()));
  
  // Filter already-sent
  const toSend = leads.filter(l => !alreadySent.has(l.email?.toLowerCase()));
  
  console.log(`\n📧 Cold Outreach Campaign`);
  console.log(`   Total leads: ${leads.length}`);
  console.log(`   Already sent: ${leads.length - toSend.length}`);
  console.log(`   To send: ${toSend.length}`);
  console.log(`   Delay: ${SEND_DELAY_MS / 1000}s between emails`);
  console.log(`   Mode: ${dryRun ? 'DRY RUN (no emails sent)' : 'LIVE'}\n`);
  
  if (toSend.length === 0) {
    console.log('Nothing to send!');
    return;
  }
  
  let sentCount = 0;
  
  for (const lead of toSend) {
    const personalizedSubject = personalizeTemplate(subject, lead);
    const personalizedBody = personalizeTemplate(template, lead);
    
    console.log(`\n📤 Sending to: ${lead.email}`);
    console.log(`   Subject: ${personalizedSubject}`);
    
    if (dryRun) {
      console.log('   [DRY RUN - not sent]');
      console.log(`   Preview:\n${personalizedBody.slice(0, 200)}...`);
    } else {
      try {
        const result = await transporter.sendMail({
          from: `"Quinn - Spencer's Assistant" <${process.env.GMAIL_USER}>`,
          to: lead.email,
          subject: personalizedSubject,
          text: personalizedBody,
          html: personalizedBody.replace(/\n/g, '<br>')
        });
        
        log.sent.push({
          email: lead.email,
          name: lead.name || lead.contact_name,
          company: lead.company || lead.business_name,
          subject: personalizedSubject,
          messageId: result.messageId,
          sentAt: new Date().toISOString()
        });
        
        await saveLog(log);
        console.log(`   ✓ Sent! (${result.messageId})`);
        sentCount++;
      } catch (err) {
        console.error(`   ✗ Failed: ${err.message}`);
        log.bounced.push({
          email: lead.email,
          error: err.message,
          at: new Date().toISOString()
        });
        await saveLog(log);
      }
    }
    
    // Rate limiting
    if (sentCount < toSend.length) {
      console.log(`   ⏳ Waiting ${SEND_DELAY_MS / 1000}s...`);
      await sleep(SEND_DELAY_MS);
    }
    
    // Hourly limit check
    if (sentCount >= MAX_SENDS_PER_HOUR) {
      console.log(`\n⚠️  Reached hourly limit (${MAX_SENDS_PER_HOUR}). Stopping.`);
      break;
    }
  }
  
  console.log(`\n✅ Campaign complete! Sent ${sentCount} emails.`);
}

// ============================================================================
// STATUS
// ============================================================================

async function showStatus() {
  const log = await loadLog();
  
  console.log('\n📊 Outreach Status\n');
  console.log(`   📤 Sent: ${log.sent.length}`);
  console.log(`   ❌ Bounced: ${log.bounced.length}`);
  console.log(`   💬 Replied: ${log.replied.length}`);
  
  if (log.sent.length > 0) {
    console.log('\nRecent sends:');
    log.sent.slice(-5).forEach(s => {
      console.log(`   ${s.sentAt.slice(0, 16)} → ${s.email} (${s.company || 'N/A'})`);
    });
  }
  
  if (log.bounced.length > 0) {
    console.log('\nRecent bounces:');
    log.bounced.slice(-5).forEach(b => {
      console.log(`   ${b.at.slice(0, 16)} → ${b.email}: ${b.error}`);
    });
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadLeads(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const content = await fs.readFile(filePath, 'utf8');
  
  if (ext === '.json') {
    return JSON.parse(content);
  } else if (ext === '.csv') {
    // Simple CSV parser
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, '_'));
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i]?.trim().replace(/^"|"$/g, '');
      });
      return obj;
    });
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const [,, command, ...args] = process.argv;
  
  switch (command) {
    case 'validate': {
      const [leadsFile] = args;
      if (!leadsFile) {
        console.log('Usage: node cold-outreach.js validate <leads.json|leads.csv>');
        return;
      }
      const leads = await loadLeads(leadsFile);
      const results = await validateLeads(leads);
      
      // Save valid leads
      const validFile = leadsFile.replace(/\.(json|csv)$/, '-valid.json');
      await fs.writeFile(validFile, JSON.stringify(results.valid, null, 2));
      console.log(`\nSaved valid leads to: ${validFile}`);
      break;
    }
    
    case 'send': {
      const [leadsFile, templateFile, ...flags] = args;
      if (!leadsFile || !templateFile) {
        console.log('Usage: node cold-outreach.js send <leads.json> <template.txt> [--dry-run] [--subject "..."]');
        return;
      }
      
      const dryRun = flags.includes('--dry-run');
      const subjectIdx = flags.indexOf('--subject');
      const subject = subjectIdx !== -1 ? flags[subjectIdx + 1] : undefined;
      
      const leads = await loadLeads(leadsFile);
      await sendCampaign(leads, templateFile, { dryRun, subject });
      break;
    }
    
    case 'status': {
      await showStatus();
      break;
    }
    
    default:
      console.log(`
Cold Email Outreach System
==========================

Commands:
  validate <leads.json|csv>   - Validate emails and save valid leads
  send <leads> <template>     - Send campaign
  status                      - Show send statistics

Options:
  --dry-run                   - Preview without sending
  --subject "..."             - Custom subject line (supports {{variables}})

Template Variables:
  {{name}}, {{first_name}}, {{company}}, {{industry}}, {{city}}, {{email}}
  Plus any custom fields in your leads file.

Example:
  node cold-outreach.js validate leads.json
  node cold-outreach.js send leads-valid.json intro-email.txt --dry-run
  node cold-outreach.js send leads-valid.json intro-email.txt --subject "AI for {{company}}?"
`);
  }
}

main().catch(console.error);
