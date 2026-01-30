#!/usr/bin/env node
/**
 * Morning Briefing Generator
 * Creates a quick daily briefing for Spencer
 * 
 * Usage: node scripts/morning-briefing.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = 'C:\\Users\\spenc\\clawd';

async function generateBriefing() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                   MORNING BRIEFING                           ║
║                   ${dateStr}                    
╚══════════════════════════════════════════════════════════════╝

🕐 Generated at ${timeStr}

`);

  // Check memory files
  const memoryDir = path.join(WORKSPACE, 'memory');
  const today = now.toISOString().split('T')[0];
  const todayLog = path.join(memoryDir, `${today}.md`);
  
  console.log('📝 MEMORY STATUS');
  console.log('─'.repeat(60));
  
  if (fs.existsSync(todayLog)) {
    const content = fs.readFileSync(todayLog, 'utf8');
    const lines = content.split('\n').slice(0, 15);
    console.log('Today\'s log exists. Preview:');
    console.log(lines.join('\n'));
    console.log('...\n');
  } else {
    console.log('No log for today yet.\n');
  }

  // Check HEARTBEAT.md
  const heartbeat = path.join(WORKSPACE, 'HEARTBEAT.md');
  if (fs.existsSync(heartbeat)) {
    console.log('📋 HEARTBEAT TASKS');
    console.log('─'.repeat(60));
    const hbContent = fs.readFileSync(heartbeat, 'utf8');
    console.log(hbContent.slice(0, 500));
    console.log('\n');
  }

  // Check for leads
  const leadsDir = path.join(WORKSPACE, 'leads');
  if (fs.existsSync(leadsDir)) {
    const leadFiles = fs.readdirSync(leadsDir);
    console.log('📊 LEADS');
    console.log('─'.repeat(60));
    console.log(`Found ${leadFiles.length} lead file(s):`);
    leadFiles.forEach(f => console.log(`  - ${f}`));
    console.log('');
  }

  // Check business directory
  const businessDir = path.join(WORKSPACE, 'business', 'clawdbot-service');
  if (fs.existsSync(businessDir)) {
    console.log('📁 BUSINESS ASSETS');
    console.log('─'.repeat(60));
    const files = fs.readdirSync(businessDir);
    files.forEach(f => console.log(`  - ${f}`));
    console.log('');
  }

  // Priority reminders
  console.log('⚡ PRIORITY REMINDERS');
  console.log('─'.repeat(60));
  
  // Check for upcoming dates
  const memoryMd = path.join(WORKSPACE, 'MEMORY.md');
  if (fs.existsSync(memoryMd)) {
    const memory = fs.readFileSync(memoryMd, 'utf8');
    
    // Look for dates
    if (memory.includes('Valentine')) {
      console.log('❤️  Valentine\'s Day reservation at Copper Canyon - Feb 14, 6:30 PM');
    }
    if (memory.includes('$1,000') || memory.includes('Jan 31')) {
      console.log('💰 Hyperliquid goal: $1,000 by Jan 31');
    }
    if (memory.includes('Dashboard v2')) {
      console.log('📊 Dashboard v2 client work pending');
    }
  }

  console.log(`
─────────────────────────────────────────────────────────────────

💡 QUICK ACTIONS:
  • Check calendar: node scripts/gcal.js events
  • Qualify a lead: node scripts/qualify-lead.js "Company" "Rev" "Industry" "Title"
  • Check trader: powershell -File hyperliquid-telegram-agent/watchdog.ps1

─────────────────────────────────────────────────────────────────
`);
}

generateBriefing().catch(console.error);
