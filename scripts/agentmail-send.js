// Send email via AgentMail
// Usage: node agentmail-send.js <to> <subject> <body>

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const apiKey = process.env.AGENTMAIL_API_KEY;
const fromEmail = process.env.AGENTMAIL_EMAIL || 'quinnorsted@agentmail.to';
const baseUrl = 'https://api.agentmail.to/v0';

async function sendEmail(to, subject, body) {
  if (!apiKey) {
    console.error('Error: AGENTMAIL_API_KEY not set in .env');
    process.exit(1);
  }

  try {
    const response = await fetch(`${baseUrl}/inboxes/${encodeURIComponent(fromEmail)}/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: to,
        subject: subject,
        text: body
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error ${response.status}: ${err}`);
    }

    const result = await response.json();

    console.log(JSON.stringify({
      status: 'sent',
      to: to,
      subject: subject,
      from: fromEmail,
      result: result
    }, null, 2));

  } catch (error) {
    console.error('Error sending email:', error.message);
    process.exit(1);
  }
}

// Parse command line args
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node agentmail-send.js <to> <subject> <body>');
  console.log('Example: node agentmail-send.js test@example.com "Hello" "This is the body"');
  process.exit(1);
}

const [to, subject, ...bodyParts] = args;
const body = bodyParts.join(' ');

sendEmail(to, subject, body);
