# Check Airtable Clients Skill

## Description
Connects to the Airtable MCP server to check for neglected clients and provide a status report.

## Invocation
`/check-airtable` or `/check-airtable [criteria]`

## Instructions for Claude

When the user invokes `/check-airtable`, use the Airtable MCP tools to:

### Step 1: Discover Available Data
1. Use `mcp__airtable__list_bases` to find all accessible Airtable bases
2. Use `mcp__airtable__list_tables` to find tables that likely contain client data (look for tables named "Clients", "Customers", "Contacts", "Accounts", "CRM", or similar)

### Step 2: Analyze the Client Table
1. Use `mcp__airtable__describe_table` to understand the table structure
2. Look for fields that indicate:
   - Last contact date (e.g., "Last Contact", "Last Touched", "Last Activity", "Last Email", "Last Call")
   - Status fields (e.g., "Status", "Stage", "Pipeline Stage")
   - Follow-up dates (e.g., "Next Follow-up", "Follow Up Date", "Due Date")
   - Notes or activity fields

### Step 3: Identify Neglected Clients
1. Use `mcp__airtable__list_records` or `mcp__airtable__search_records` to fetch client records
2. Consider a client "neglected" if:
   - Last contact was more than 30 days ago (or use user-specified criteria)
   - Follow-up date has passed
   - Status indicates they need attention (e.g., "Needs Follow-up", "At Risk", "Stale")
   - No recent activity logged

### Step 4: Report Findings
Present a clear summary:
- Total number of clients reviewed
- Number of neglected clients
- List of neglected clients with:
  - Client name
  - Last contact date
  - Days since last contact
  - Any relevant notes or status
- Recommended actions

## Optional Criteria
If the user specifies criteria, adjust the analysis:
- `/check-airtable 14 days` - Flag clients not contacted in 14 days
- `/check-airtable high priority` - Focus on high-priority clients only
- `/check-airtable [table name]` - Check a specific table

## Example Output Format
```
## Airtable Client Check Report

**Base:** Sales CRM
**Table:** Clients
**Date:** January 16, 2026

### Summary
- Total Clients: 45
- Neglected (30+ days): 8
- Needs Immediate Attention: 3

### Neglected Clients

| Client | Last Contact | Days Ago | Status |
|--------|--------------|----------|--------|
| Acme Corp | Dec 1, 2025 | 46 days | Active |
| Beta Inc | Dec 10, 2025 | 37 days | Proposal Sent |
...

### Recommended Actions
1. Prioritize Acme Corp - longest time without contact
2. Follow up on Beta Inc proposal
...
```

## Notes
- This skill requires the Airtable MCP server to be configured
- The MCP server must have read access to the relevant bases
- Adjust "neglected" thresholds based on your business needs
