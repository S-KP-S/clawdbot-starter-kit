#!/usr/bin/env node
/**
 * Proposal Generator for skps.agency
 * 
 * Quickly generates a proposal from lead information.
 * 
 * Usage:
 *   node scripts/generate-proposal.js "Company Name" "Contact Name" "Title" "Industry" "Revenue" "Tier"
 * 
 * Example:
 *   node scripts/generate-proposal.js "Harbor Marketing" "Steve Krakower" "CEO" "Marketing Agency" "$1M-$5M" "Growth"
 */

const fs = require('fs');
const path = require('path');

// Tier configurations
const TIERS = {
  starter: {
    name: 'Starter',
    price: 3500,
    users: 1,
    integrations: 1,
    timeline: '5-7 business days',
    paymentTerms: '100% upfront',
    includes: [
      'Discovery call (30 min)',
      'Clawdbot installation & configuration',
      '1 core integration of your choice',
      'Personality & voice customization',
      'Written documentation',
      '30-minute training session',
      '14 days email support'
    ]
  },
  growth: {
    name: 'Growth',
    price: 12500,
    users: 5,
    integrations: 5,
    timeline: '2-3 weeks',
    paymentTerms: '50% upfront ($6,250), 50% at delivery ($6,250)',
    includes: [
      'Deep-dive discovery session (90 min)',
      'Full Clawdbot implementation',
      'Up to 5 integrations (email, calendar, CRM, messaging, voice)',
      '3 custom workflow automations',
      'Full personality customization',
      'Memory system configuration',
      'Up to 5 user accounts',
      '2-hour team training session',
      'Video documentation',
      '30 days priority support',
      '2 optimization calls'
    ]
  },
  ownership: {
    name: 'Ownership Blueprint',
    price: 35000,
    users: 'Unlimited',
    integrations: 'Unlimited',
    timeline: '4-6 weeks + 90-day optimization',
    paymentTerms: '40% upfront ($14,000), 40% midpoint ($14,000), 20% delivery ($7,000)',
    includes: [
      'Phase 1: AUDIT — Executive discovery workshop & operational assessment',
      'Phase 2: ASCEND — Full implementation with unlimited integrations',
      'Phase 3: AUTOMATE — 90-day optimization program',
      'Custom API development',
      'Advanced workflow automation',
      'Custom tool/skill development',
      'White-label branding option',
      'Unlimited user accounts',
      'Complete team training',
      'Executive briefing',
      'Weekly optimization calls for 90 days',
      'Dedicated support channel (4-hour SLA)',
      'Full documentation package'
    ]
  }
};

// ROI estimates by tier
const ROI_ESTIMATES = {
  starter: { hoursWeek: 10, hourlyValue: 100, paybackWeeks: 4 },
  growth: { hoursWeek: 20, hourlyValue: 125, paybackWeeks: 5 },
  ownership: { hoursWeek: 50, hourlyValue: 150, paybackWeeks: 5 }
};

function generateProposal(company, contact, title, industry, revenue, tierKey) {
  const tier = TIERS[tierKey.toLowerCase()];
  const roi = ROI_ESTIMATES[tierKey.toLowerCase()];
  
  if (!tier) {
    console.error(`Unknown tier: ${tierKey}. Use: starter, growth, or ownership`);
    process.exit(1);
  }

  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const weeklyValue = roi.hoursWeek * roi.hourlyValue;
  const monthlyValue = weeklyValue * 4;
  const annualValue = monthlyValue * 12;

  const proposal = `# AI Assistant Implementation Proposal

**Prepared for:** ${company}
**Attention:** ${contact}, ${title}
**Date:** ${date}
**Prepared by:** Spencer Strandholt, skps.agency

---

## Executive Summary

${company} is positioned to leverage AI to dramatically reduce operational overhead and scale more efficiently. Based on our understanding of your business, I'm recommending the **${tier.name} Package** — designed specifically for ${industry.toLowerCase()} companies in the ${revenue} revenue range.

This proposal outlines how we'll implement an AI-powered assistant that handles your email, scheduling, CRM updates, and follow-ups — giving you and your team back hours every week.

---

## The Opportunity

**Your current challenge:**
- Time spent on admin tasks that don't directly generate revenue
- Email and scheduling consuming valuable hours
- Follow-ups and CRM updates falling through the cracks
- Growing team needs systematized support

**The solution:**
An AI assistant (Clawdbot) configured specifically for ${company} that:
- Manages email triage and drafts responses
- Handles scheduling without back-and-forth
- Keeps your CRM updated automatically
- Follows up with leads and clients
- Learns your preferences and improves over time

---

## Recommended Package: ${tier.name}

**Investment:** $${tier.price.toLocaleString()}

**Timeline:** ${tier.timeline}

### What's Included

${tier.includes.map(item => `- ${item}`).join('\n')}

---

## ROI Projection

| Metric | Estimate |
|--------|----------|
| Hours saved per week | ${roi.hoursWeek} hours |
| Value of your time | $${roi.hourlyValue}/hour |
| Weekly value recovered | $${weeklyValue.toLocaleString()} |
| Monthly value recovered | $${monthlyValue.toLocaleString()} |
| Annual value recovered | $${annualValue.toLocaleString()} |
| **Payback period** | **~${roi.paybackWeeks} weeks** |

**First-year ROI:** ${Math.round((annualValue / tier.price - 1) * 100)}%

---

## Implementation Timeline

${tierKey.toLowerCase() === 'ownership' ? `
### Phase 1: AUDIT (Week 1)
- Executive discovery workshop
- Operational assessment
- Integration mapping
- Transformation roadmap

### Phase 2: ASCEND (Weeks 2-4)
- Clawdbot installation
- Integration setup
- Workflow automation
- Team training

### Phase 3: AUTOMATE (Weeks 5-12)
- Weekly optimization calls
- Continuous improvement
- Performance monitoring
- Knowledge transfer
` : `
### Week 1: Discovery & Setup
- Kickoff call to align on priorities
- Clawdbot installation
- Core integration configuration

### Week 2${tierKey.toLowerCase() === 'growth' ? '-3' : ''}: Configuration & Training
- Workflow setup
- Personality customization
- Team training
- Documentation

### Post-Launch: Optimization
- Support period begins
- ${tierKey.toLowerCase() === 'growth' ? 'Optimization calls scheduled' : 'Email support available'}
- Refinements based on usage
`}

---

## Investment Summary

| Item | Amount |
|------|--------|
| ${tier.name} Package | $${tier.price.toLocaleString()} |
| **Total Investment** | **$${tier.price.toLocaleString()}** |

### Payment Terms
${tier.paymentTerms}

---

## Next Steps

1. **Schedule a call** — Let's discuss your specific needs and answer any questions
2. **Sign agreement** — Simple contract outlining scope and timeline
3. **Kickoff** — We start building your AI assistant

---

## About skps.agency

I'm Spencer Strandholt, founder of skps.agency. I help business owners reclaim their time by implementing AI assistants that actually work. My approach is hands-on — I configure everything specifically for your business, train your team, and stick around to make sure it's working.

No generic setups. No cookie-cutter solutions. Just AI that works the way you work.

**Let's talk:** spencer@skps.agency | skps.agency

---

*This proposal is valid for 30 days from the date above.*
`;

  return proposal;
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 6) {
  console.log(`
Proposal Generator for skps.agency

Usage:
  node scripts/generate-proposal.js "Company" "Contact" "Title" "Industry" "Revenue" "Tier"

Tiers:
  - starter    ($3,500)
  - growth     ($12,500)  
  - ownership  ($35,000)

Example:
  node scripts/generate-proposal.js "Harbor Marketing" "Steve Krakower" "CEO" "Marketing Agency" "$1M-$5M" "growth"

Output:
  Creates proposals/[company-name]-proposal.md
`);
  process.exit(0);
}

const [company, contact, title, industry, revenue, tier] = args;

const proposal = generateProposal(company, contact, title, industry, revenue, tier);

// Ensure proposals directory exists
const proposalsDir = path.join(__dirname, '..', 'proposals');
if (!fs.existsSync(proposalsDir)) {
  fs.mkdirSync(proposalsDir, { recursive: true });
}

// Save proposal
const filename = company.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-proposal.md';
const filepath = path.join(proposalsDir, filename);
fs.writeFileSync(filepath, proposal);

console.log(`✅ Proposal generated: ${filepath}`);
console.log(`
Summary:
  Company: ${company}
  Contact: ${contact} (${title})
  Package: ${TIERS[tier.toLowerCase()].name}
  Price: $${TIERS[tier.toLowerCase()].price.toLocaleString()}
`);
