#!/usr/bin/env node
/**
 * SKPS Agency Cold Outreach Script
 * Sends personalized emails via AgentMail API
 * 
 * Usage:
 *   node send-skps-outreach.js                    # Send all leads
 *   node send-skps-outreach.js --dry-run          # Preview without sending
 *   node send-skps-outreach.js --limit 5          # Send only 5 emails
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');

// Config
const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY;
const FROM_EMAIL = 'quinnorsted@agentmail.to';
const RATE_LIMIT_MS = 30000; // 30 seconds between emails
const LEADS_FILE = path.join(__dirname, '..', 'tmp', 'skps-leads.json');
const LOG_FILE = path.join(__dirname, '..', 'tmp', 'outreach-log.csv');

// Parse args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : Infinity;

// Email template
function generateEmail(lead) {
  const subject = `Quick question about ${lead.company}`;
  
  const body = `Hey ${lead.name},

${lead.personalization_hook}

I run an AI automation agency and noticed ${lead.pain_point}.

We've helped businesses like yours automate the repetitive stuff — so your team can focus on what actually moves the needle.

Would you be open to a free 15-min audit call? I'll show you 2-3 quick wins you could implement this month.

No pitch, just value. If it makes sense to work together after, great. If not, you walk away with a game plan.

Worth a quick chat?

— Spencer
SKPS Agency | skps.agency`;

  return { subject, body };
}

// Send email via AgentMail
async function sendEmail(to, subject, body) {
  const response = await fetch(`https://api.agentmail.to/v0/inboxes/${FROM_EMAIL}/messages/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AGENTMAIL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: [to],
      subject: subject,
      text: body
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AgentMail API error: ${response.status} - ${error}`);
  }

  return await response.json();
}

// Log to CSV
function logSend(lead, status, messageId = null) {
  const timestamp = new Date().toISOString();
  const line = `"${timestamp}","${lead.email}","${lead.company}","${lead.name}","${status}","${messageId || ''}"\n`;
  
  // Create header if file doesn't exist
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, 'timestamp,email,company,name,status,message_id\n');
  }
  
  fs.appendFileSync(LOG_FILE, line);
}

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main
async function main() {
  console.log('='.repeat(50));
  console.log('SKPS Agency Cold Outreach');
  console.log('='.repeat(50));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no emails sent)' : 'LIVE'}`);
  console.log(`Limit: ${LIMIT === Infinity ? 'None' : LIMIT}`);
  console.log('');

  // Check API key
  if (!AGENTMAIL_API_KEY) {
    console.error('ERROR: AGENTMAIL_API_KEY not found in .env');
    process.exit(1);
  }

  // Load leads
  if (!fs.existsSync(LEADS_FILE)) {
    console.error(`ERROR: Leads file not found: ${LEADS_FILE}`);
    console.log('Create a JSON file with array of leads:');
    console.log('[{ "name": "John", "email": "john@example.com", "company": "Acme", "personalization_hook": "...", "pain_point": "..." }]');
    process.exit(1);
  }

  const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  const toSend = leads.slice(0, LIMIT);

  console.log(`Loaded ${leads.length} leads, sending to ${toSend.length}`);
  console.log('');

  let sent = 0;
  let failed = 0;

  for (const lead of toSend) {
    const { subject, body } = generateEmail(lead);

    console.log(`[${sent + failed + 1}/${toSend.length}] ${lead.company} (${lead.email})`);
    console.log(`  Subject: ${subject}`);
    
    if (DRY_RUN) {
      console.log('  Status: SKIPPED (dry run)');
      console.log(`  Preview:\n${body.split('\n').slice(0, 3).map(l => '    ' + l).join('\n')}...`);
      logSend(lead, 'dry-run');
    } else {
      try {
        const result = await sendEmail(lead.email, subject, body);
        console.log(`  Status: SENT ✓`);
        console.log(`  Message ID: ${result.message_id || 'N/A'}`);
        logSend(lead, 'sent', result.message_id);
        sent++;

        // Rate limit
        if (sent + failed < toSend.length) {
          console.log(`  Waiting ${RATE_LIMIT_MS / 1000}s before next email...`);
          await sleep(RATE_LIMIT_MS);
        }
      } catch (error) {
        console.log(`  Status: FAILED ✗`);
        console.log(`  Error: ${error.message}`);
        logSend(lead, 'failed');
        failed++;
      }
    }
    console.log('');
  }

  console.log('='.repeat(50));
  console.log('Summary:');
  console.log(`  Sent: ${sent}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Log: ${LOG_FILE}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
