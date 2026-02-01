#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Paths
const KEYS_PATH = path.join(process.env.USERPROFILE, '.config', 'mcp-gdrive', 'gcp-oauth.keys.json');
const TOKENS_PATH = path.join(process.env.USERPROFILE, '.config', 'google-calendar', 'tokens.json');

async function getCalendar() {
  const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  
  const oauth2Client = new google.auth.OAuth2(
    keys.installed.client_id,
    keys.installed.client_secret,
    'http://localhost:3456/callback'
  );
  oauth2Client.setCredentials(tokens);
  
  // Refresh token if needed
  oauth2Client.on('tokens', (newTokens) => {
    const updated = { ...tokens, ...newTokens };
    fs.writeFileSync(TOKENS_PATH, JSON.stringify(updated, null, 2));
  });
  
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

async function listCalendars() {
  const calendar = await getCalendar();
  const res = await calendar.calendarList.list();
  return res.data.items.map(c => ({ id: c.id, name: c.summary, primary: c.primary }));
}

async function listEvents(calendarId = 'primary', maxResults = 10) {
  const calendar = await getCalendar();
  const res = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items.map(e => ({
    id: e.id,
    summary: e.summary,
    start: e.start.dateTime || e.start.date,
    end: e.end.dateTime || e.end.date,
    meetLink: e.hangoutLink,
  }));
}

async function createEvent(options) {
  const calendar = await getCalendar();
  
  const event = {
    summary: options.title,
    description: options.description || '',
    start: {
      dateTime: options.start,
      timeZone: options.timezone || 'America/Chicago',
    },
    end: {
      dateTime: options.end,
      timeZone: options.timezone || 'America/Chicago',
    },
    attendees: options.attendees?.map(email => ({ email })) || [],
  };
  
  // Add Google Meet if requested
  if (options.meet) {
    event.conferenceData = {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }
  
  const res = await calendar.events.insert({
    calendarId: options.calendarId || 'primary',
    resource: event,
    conferenceDataVersion: options.meet ? 1 : 0,
    sendUpdates: options.notify ? 'all' : 'none',
  });
  
  return {
    id: res.data.id,
    summary: res.data.summary,
    start: res.data.start.dateTime,
    end: res.data.end.dateTime,
    htmlLink: res.data.htmlLink,
    meetLink: res.data.hangoutLink,
  };
}

async function deleteEvent(eventId, calendarId = 'primary') {
  const calendar = await getCalendar();
  await calendar.events.delete({ calendarId, eventId });
  return { deleted: true, eventId };
}

// CLI
async function main() {
  const [,, cmd, ...args] = process.argv;
  
  switch (cmd) {
    case 'calendars':
      console.log(JSON.stringify(await listCalendars(), null, 2));
      break;
      
    case 'events':
      console.log(JSON.stringify(await listEvents(args[0], parseInt(args[1]) || 10), null, 2));
      break;
      
    case 'create':
      // Usage: node gcal.js create '{"title":"Meeting","start":"2026-01-27T10:00:00","end":"2026-01-27T11:00:00","meet":true}'
      const opts = JSON.parse(args[0]);
      console.log(JSON.stringify(await createEvent(opts), null, 2));
      break;
      
    case 'delete':
      console.log(JSON.stringify(await deleteEvent(args[0], args[1]), null, 2));
      break;
      
    default:
      console.log(`
Google Calendar CLI

Commands:
  calendars           - List all calendars
  events [cal] [n]    - List next n events (default: primary, 10)
  create '{json}'     - Create event with JSON options:
                        title, description, start, end, timezone,
                        attendees (array), meet (bool), notify (bool)
  delete <id> [cal]   - Delete event by ID

Examples:
  node gcal.js events
  node gcal.js create '{"title":"Call with John","start":"2026-01-27T14:00:00","end":"2026-01-27T14:30:00","meet":true,"attendees":["john@example.com"]}'
`);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
