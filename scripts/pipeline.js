#!/usr/bin/env node
/**
 * Sales Pipeline Tracker for skps.agency
 * 
 * Track leads through the sales process:
 *   New → Contacted → Discovery → Proposal → Negotiation → Won/Lost
 * 
 * Usage:
 *   node scripts/pipeline.js list                    # Show all leads
 *   node scripts/pipeline.js add "Company" "Contact" "Email" "Source"
 *   node scripts/pipeline.js update "Company" "stage" "notes"
 *   node scripts/pipeline.js stats                   # Pipeline stats
 *   node scripts/pipeline.js import leads.csv        # Import from CSV
 */

const fs = require('fs');
const path = require('path');

const PIPELINE_FILE = path.join(__dirname, '..', 'business', 'pipeline.json');

const STAGES = [
  'new',
  'contacted',
  'discovery',
  'proposal',
  'negotiation',
  'won',
  'lost'
];

const STAGE_DISPLAY = {
  new: '🆕 New',
  contacted: '📧 Contacted',
  discovery: '🎯 Discovery',
  proposal: '📝 Proposal',
  negotiation: '💬 Negotiation',
  won: '✅ Won',
  lost: '❌ Lost'
};

// Load pipeline data
function loadPipeline() {
  if (!fs.existsSync(PIPELINE_FILE)) {
    return { leads: [], lastUpdated: null };
  }
  return JSON.parse(fs.readFileSync(PIPELINE_FILE, 'utf8'));
}

// Save pipeline data
function savePipeline(data) {
  data.lastUpdated = new Date().toISOString();
  const dir = path.dirname(PIPELINE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(PIPELINE_FILE, JSON.stringify(data, null, 2));
}

// Add a lead
function addLead(company, contact, email, source, tier = null, revenue = null) {
  const data = loadPipeline();
  
  // Check for duplicate
  const existing = data.leads.find(l => 
    l.company.toLowerCase() === company.toLowerCase()
  );
  if (existing) {
    console.log(`⚠️  Lead "${company}" already exists (stage: ${existing.stage})`);
    return;
  }

  const lead = {
    id: Date.now().toString(36),
    company,
    contact,
    email,
    source,
    tier,
    revenue,
    stage: 'new',
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [{ stage: 'new', date: new Date().toISOString() }]
  };

  data.leads.push(lead);
  savePipeline(data);
  console.log(`✅ Added: ${company} (${contact})`);
}

// Update lead stage
function updateLead(company, newStage, note = null) {
  const data = loadPipeline();
  
  const lead = data.leads.find(l => 
    l.company.toLowerCase().includes(company.toLowerCase())
  );
  
  if (!lead) {
    console.log(`❌ Lead not found: ${company}`);
    return;
  }

  if (!STAGES.includes(newStage.toLowerCase())) {
    console.log(`❌ Invalid stage: ${newStage}`);
    console.log(`Valid stages: ${STAGES.join(', ')}`);
    return;
  }

  const oldStage = lead.stage;
  lead.stage = newStage.toLowerCase();
  lead.updatedAt = new Date().toISOString();
  lead.history.push({ 
    stage: newStage.toLowerCase(), 
    date: new Date().toISOString(),
    from: oldStage
  });

  if (note) {
    lead.notes.push({
      text: note,
      date: new Date().toISOString()
    });
  }

  savePipeline(data);
  console.log(`✅ Updated: ${lead.company}`);
  console.log(`   ${STAGE_DISPLAY[oldStage]} → ${STAGE_DISPLAY[lead.stage]}`);
  if (note) console.log(`   Note: ${note}`);
}

// List leads
function listLeads(filterStage = null) {
  const data = loadPipeline();
  
  if (data.leads.length === 0) {
    console.log('📭 Pipeline is empty. Add leads with: node pipeline.js add "Company" "Contact" "Email" "Source"');
    return;
  }

  // Group by stage
  const byStage = {};
  STAGES.forEach(s => byStage[s] = []);
  
  data.leads.forEach(lead => {
    if (!filterStage || lead.stage === filterStage) {
      byStage[lead.stage].push(lead);
    }
  });

  console.log('\n📊 SALES PIPELINE\n');
  console.log('═'.repeat(60));

  STAGES.forEach(stage => {
    const leads = byStage[stage];
    if (leads.length > 0 || !filterStage) {
      console.log(`\n${STAGE_DISPLAY[stage]} (${leads.length})`);
      console.log('─'.repeat(40));
      
      if (leads.length === 0) {
        console.log('  (empty)');
      } else {
        leads.forEach(lead => {
          const daysSince = Math.floor(
            (Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          const stale = daysSince > 7 ? ' ⚠️' : '';
          console.log(`  • ${lead.company}${stale}`);
          console.log(`    ${lead.contact} <${lead.email}>`);
          if (lead.tier) console.log(`    Tier: ${lead.tier} | Revenue: ${lead.revenue || 'Unknown'}`);
          console.log(`    Last updated: ${daysSince} days ago`);
        });
      }
    }
  });

  console.log('\n' + '═'.repeat(60));
}

// Pipeline stats
function showStats() {
  const data = loadPipeline();
  
  const stats = {
    total: data.leads.length,
    byStage: {},
    avgDaysInPipeline: 0,
    potentialRevenue: 0,
    wonRevenue: 0,
    conversionRate: 0
  };

  const tierPrices = { starter: 3500, growth: 12500, ownership: 35000 };
  let totalDays = 0;

  STAGES.forEach(s => stats.byStage[s] = 0);

  data.leads.forEach(lead => {
    stats.byStage[lead.stage]++;
    
    const days = Math.floor(
      (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    totalDays += days;

    if (lead.tier && tierPrices[lead.tier.toLowerCase()]) {
      const value = tierPrices[lead.tier.toLowerCase()];
      if (lead.stage === 'won') {
        stats.wonRevenue += value;
      } else if (!['lost'].includes(lead.stage)) {
        stats.potentialRevenue += value;
      }
    }
  });

  if (stats.total > 0) {
    stats.avgDaysInPipeline = Math.round(totalDays / stats.total);
  }

  const closed = stats.byStage.won + stats.byStage.lost;
  if (closed > 0) {
    stats.conversionRate = Math.round((stats.byStage.won / closed) * 100);
  }

  console.log('\n📈 PIPELINE STATS\n');
  console.log('═'.repeat(40));
  console.log(`Total leads: ${stats.total}`);
  console.log('');
  
  STAGES.forEach(stage => {
    const count = stats.byStage[stage];
    const bar = '█'.repeat(count) + '░'.repeat(Math.max(0, 10 - count));
    console.log(`${STAGE_DISPLAY[stage].padEnd(20)} ${bar} ${count}`);
  });

  console.log('');
  console.log(`Avg days in pipeline: ${stats.avgDaysInPipeline}`);
  console.log(`Conversion rate: ${stats.conversionRate}%`);
  console.log('');
  console.log(`💰 Potential revenue: $${stats.potentialRevenue.toLocaleString()}`);
  console.log(`✅ Won revenue: $${stats.wonRevenue.toLocaleString()}`);
  console.log('═'.repeat(40));
}

// Import from CSV
function importFromCSV(csvPath) {
  if (!fs.existsSync(csvPath)) {
    console.log(`❌ File not found: ${csvPath}`);
    return;
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z]/g, ''));
  
  let imported = 0;
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parsing (doesn't handle all edge cases)
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const cleaned = values.map(v => v.replace(/^"|"$/g, '').trim());

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cleaned[idx] || '';
    });

    const company = row.companyname || row.company || row.name;
    const contact = row.contactname || row.contact || row.fullname;
    const email = row.email;
    const revenue = row.revenueestimate || row.revenue;
    const industry = row.industry;

    if (company && email) {
      const data = loadPipeline();
      const exists = data.leads.find(l => 
        l.company.toLowerCase() === company.toLowerCase()
      );
      
      if (!exists) {
        addLead(company, contact, email, 'csv-import', null, revenue);
        imported++;
      } else {
        skipped++;
      }
    }
  }

  console.log(`\n✅ Imported ${imported} leads, skipped ${skipped} duplicates`);
}

// Main
const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'add':
    if (args.length < 4) {
      console.log('Usage: node pipeline.js add "Company" "Contact" "Email" "Source"');
    } else {
      addLead(args[0], args[1], args[2], args[3], args[4], args[5]);
    }
    break;

  case 'update':
    if (args.length < 2) {
      console.log('Usage: node pipeline.js update "Company" "stage" ["notes"]');
      console.log(`Stages: ${STAGES.join(', ')}`);
    } else {
      updateLead(args[0], args[1], args[2]);
    }
    break;

  case 'list':
    listLeads(args[0]);
    break;

  case 'stats':
    showStats();
    break;

  case 'import':
    if (!args[0]) {
      console.log('Usage: node pipeline.js import leads.csv');
    } else {
      importFromCSV(args[0]);
    }
    break;

  default:
    console.log(`
📊 Sales Pipeline Tracker

Commands:
  list              Show all leads by stage
  list <stage>      Filter by stage (new, contacted, discovery, proposal, negotiation, won, lost)
  add               Add a new lead
  update            Update lead stage
  stats             Show pipeline statistics
  import            Import leads from CSV

Examples:
  node scripts/pipeline.js list
  node scripts/pipeline.js add "Acme Corp" "John Smith" "john@acme.com" "cold-email"
  node scripts/pipeline.js update "Acme" "contacted" "Sent intro email"
  node scripts/pipeline.js stats
  node scripts/pipeline.js import leads/2026-01-30-leads.csv
`);
}
