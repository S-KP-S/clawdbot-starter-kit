#!/usr/bin/env node
/**
 * Lead Qualification Tool
 * Quickly score and qualify leads against Spencer's ICP
 * 
 * Usage: node scripts/qualify-lead.js "Company Name" "Revenue" "Industry" "Decision Maker Title"
 * Example: node scripts/qualify-lead.js "Acme Marketing" "2M" "Agency" "CEO"
 */

const ICP_CRITERIA = {
  // Revenue scoring (sweet spot: $1M-$5M)
  revenue: {
    '500K-1M': 70,
    '1M-5M': 100,
    '5M-10M': 85,
    '10M+': 60,
    '<500K': 40,
    'unknown': 50
  },
  
  // Industry tiers
  industry: {
    // Tier 1 - Best fit
    'agency': 100,
    'marketing agency': 100,
    'creative agency': 100,
    'development agency': 100,
    'professional services': 95,
    'consulting': 95,
    'coaching': 90,
    'accounting': 90,
    'legal': 85,
    'real estate': 95,
    'property management': 90,
    'saas': 95,
    'tech startup': 90,
    
    // Tier 2 - Good fit
    'ecommerce': 75,
    'healthcare': 70,
    'financial advisor': 80,
    'wealth management': 80,
    'recruiting': 75,
    'staffing': 75,
    'home services': 70,
    'hvac': 65,
    'plumbing': 65,
    'electrical': 65,
    
    // Tier 3 - Situational
    'local business': 50,
    'nonprofit': 40,
    'creator': 45,
    'influencer': 45,
    'other': 50
  },
  
  // Decision maker titles
  title: {
    'founder': 100,
    'ceo': 100,
    'owner': 100,
    'coo': 95,
    'operations': 90,
    'general manager': 90,
    'gm': 90,
    'head of ops': 80,
    'director of operations': 80,
    'office manager': 60,
    'cto': 40,
    'technical': 35,
    'manager': 55,
    'other': 50
  }
};

function normalizeInput(input) {
  return input.toLowerCase().trim();
}

function parseRevenue(revenueStr) {
  const rev = normalizeInput(revenueStr);
  
  if (rev.includes('m')) {
    const num = parseFloat(rev.replace(/[^0-9.]/g, ''));
    if (num < 0.5) return '<500K';
    if (num < 1) return '500K-1M';
    if (num <= 5) return '1M-5M';
    if (num <= 10) return '5M-10M';
    return '10M+';
  }
  
  if (rev.includes('k')) {
    const num = parseFloat(rev.replace(/[^0-9.]/g, ''));
    if (num < 500) return '<500K';
    return '500K-1M';
  }
  
  return 'unknown';
}

function findBestMatch(input, options) {
  const normalized = normalizeInput(input);
  
  // Exact match
  if (options[normalized]) return normalized;
  
  // Partial match
  for (const key of Object.keys(options)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return key;
    }
  }
  
  return 'other';
}

function qualifyLead(company, revenue, industry, title) {
  const revenueBucket = parseRevenue(revenue);
  const industryMatch = findBestMatch(industry, ICP_CRITERIA.industry);
  const titleMatch = findBestMatch(title, ICP_CRITERIA.title);
  
  const scores = {
    revenue: ICP_CRITERIA.revenue[revenueBucket] || 50,
    industry: ICP_CRITERIA.industry[industryMatch] || 50,
    title: ICP_CRITERIA.title[titleMatch] || 50
  };
  
  // Weighted average (industry and title matter most)
  const totalScore = Math.round(
    (scores.revenue * 0.25) + 
    (scores.industry * 0.35) + 
    (scores.title * 0.40)
  );
  
  // Qualification tier
  let tier, action;
  if (totalScore >= 90) {
    tier = '🟢 HOT LEAD';
    action = 'Reach out immediately. High-fit prospect.';
  } else if (totalScore >= 75) {
    tier = '🟡 WARM LEAD';
    action = 'Good fit. Add to outreach sequence.';
  } else if (totalScore >= 60) {
    tier = '🟠 QUALIFIED';
    action = 'Decent fit. Lower priority outreach.';
  } else {
    tier = '🔴 LOW FIT';
    action = 'Skip or revisit later. Not ideal ICP.';
  }
  
  return {
    company,
    totalScore,
    tier,
    action,
    breakdown: {
      revenue: `${revenueBucket} (${scores.revenue}/100)`,
      industry: `${industryMatch} (${scores.industry}/100)`,
      title: `${titleMatch} (${scores.title}/100)`
    },
    redFlags: getRedFlags(industry, title)
  };
}

function getRedFlags(industry, title) {
  const flags = [];
  const ind = normalizeInput(industry);
  const ttl = normalizeInput(title);
  
  if (ttl.includes('cto') || ttl.includes('technical')) {
    flags.push('⚠️ Technical title - may want to DIY');
  }
  if (ttl.includes('it') || ttl.includes('developer')) {
    flags.push('⚠️ IT role - likely wants technical control');
  }
  if (ind.includes('nonprofit') && !ind.includes('funded')) {
    flags.push('⚠️ Nonprofit - verify budget availability');
  }
  
  return flags;
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 4) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              LEAD QUALIFICATION TOOL                        ║
║              Spencer's AI Automation Agency                 ║
╚══════════════════════════════════════════════════════════════╝

Usage: node scripts/qualify-lead.js "Company" "Revenue" "Industry" "Title"

Examples:
  node scripts/qualify-lead.js "Acme Marketing" "2M" "Marketing Agency" "CEO"
  node scripts/qualify-lead.js "Smith Real Estate" "800K" "Real Estate" "Broker"
  node scripts/qualify-lead.js "TechCorp" "5M" "SaaS" "COO"

Revenue formats: 500K, 1M, 2.5M, 10M+, etc.
  `);
  process.exit(0);
}

const [company, revenue, industry, title] = args;
const result = qualifyLead(company, revenue, industry, title);

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    LEAD QUALIFICATION                        ║
╚══════════════════════════════════════════════════════════════╝

Company:     ${result.company}
Score:       ${result.totalScore}/100
Status:      ${result.tier}

─────────────────────────────────────────────────────────────────
BREAKDOWN:
  Revenue:   ${result.breakdown.revenue}
  Industry:  ${result.breakdown.industry}
  Title:     ${result.breakdown.title}

─────────────────────────────────────────────────────────────────
ACTION: ${result.action}
${result.redFlags.length > 0 ? '\nRED FLAGS:\n  ' + result.redFlags.join('\n  ') : ''}
`);
