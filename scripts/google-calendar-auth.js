const fs = require('fs');
const path = require('path');
const http = require('http');
const { google } = require('googleapis');
const { exec } = require('child_process');

// Paths
const KEYS_PATH = path.join(process.env.USERPROFILE, '.config', 'mcp-gdrive', 'gcp-oauth.keys.json');
const TOKENS_PATH = path.join(process.env.USERPROFILE, '.config', 'google-calendar', 'tokens.json');

// Scopes - Calendar + Meet
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

async function main() {
  // Load OAuth client credentials
  const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
  const { client_id, client_secret } = keys.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'http://localhost:3456/callback'
  );

  // Check if we already have tokens
  if (fs.existsSync(TOKENS_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
    oauth2Client.setCredentials(tokens);
    console.log('✅ Already authenticated! Testing Calendar API...');
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const res = await calendar.calendarList.list({ maxResults: 3 });
    console.log('Your calendars:', res.data.items.map(c => c.summary).join(', '));
    return;
  }

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  console.log('Opening browser for Google authorization...');
  console.log('If browser doesn\'t open, visit:', authUrl);

  // Start local server to catch callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith('/callback')) {
        const url = new URL(req.url, 'http://localhost:3456');
        const code = url.searchParams.get('code');
        
        if (code) {
          try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            
            // Save tokens
            const dir = path.dirname(TOKENS_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
            
            console.log('✅ Tokens saved to:', TOKENS_PATH);
            
            // Test it
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
            const calRes = await calendar.calendarList.list({ maxResults: 3 });
            console.log('Your calendars:', calRes.data.items.map(c => c.summary).join(', '));
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>✅ Success!</h1><p>You can close this window.</p>');
            server.close();
            resolve();
          } catch (err) {
            console.error('Error getting tokens:', err);
            res.writeHead(500);
            res.end('Error: ' + err.message);
            server.close();
            reject(err);
          }
        }
      }
    });

    server.listen(3456, () => {
      exec(`start "" "${authUrl}"`);
    });
  });
}

main().catch(console.error);
