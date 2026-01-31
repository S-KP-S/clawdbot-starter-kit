// Check AgentMail inbox for emails
// Usage: node agentmail-check.js [limit]

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const apiKey = process.env.AGENTMAIL_API_KEY;
const inboxEmail = process.env.AGENTMAIL_EMAIL || 'quinnorsted@agentmail.to';
const baseUrl = 'https://api.agentmail.to/v0';

async function checkInbox(limit = 5) {
  if (!apiKey) {
    console.error('Error: AGENTMAIL_API_KEY not set in .env');
    process.exit(1);
  }

  try {
    // List messages in inbox
    const response = await fetch(`${baseUrl}/inboxes/${encodeURIComponent(inboxEmail)}/messages?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    
    console.log(JSON.stringify({
      status: 'ok',
      inbox: inboxEmail,
      count: data.messages?.length || 0,
      messages: data.messages || data
    }, null, 2));

  } catch (error) {
    console.error('Error checking inbox:', error.message);
    
    // Try to list inboxes to debug
    try {
      const res = await fetch(`${baseUrl}/inboxes`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const inboxes = await res.json();
      console.log('Available inboxes:', JSON.stringify(inboxes, null, 2));
    } catch (e) {
      console.error('Could not list inboxes:', e.message);
    }
    process.exit(1);
  }
}

const limit = parseInt(process.argv[2]) || 5;
checkInbox(limit);
