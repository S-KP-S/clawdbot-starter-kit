# HEARTBEAT.md

<!-- Customize this with what YOU want your assistant to check -->

## What to Check

When a heartbeat fires, rotate through these:

### Email (if configured)
```bash
node scripts/check-email.js 5 UNSEEN
```
Alert if anything important/urgent.

### Calendar (if configured)
```bash
node scripts/gcal.js events primary 5
```
Alert if something's coming up in the next 2 hours.

### Custom Checks
<!-- Add your own! Examples: -->
<!-- - Check a specific inbox or folder -->
<!-- - Monitor a website for changes -->
<!-- - Check if a service is running -->

## State Tracking

Track last check timestamps to avoid duplicate alerts:

```json
// memory/heartbeat-state.json
{
  "lastChecks": {
    "email": null,
    "calendar": null
  }
}
```

## When to Alert vs Stay Quiet

**Alert when:**
- Urgent email from known contacts
- Calendar event in <2 hours
- Something that needs attention

**Stay quiet (HEARTBEAT_OK) when:**
- Late night hours
- Nothing new since last check
- Only spam/newsletters
