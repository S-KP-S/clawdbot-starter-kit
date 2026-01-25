// Quick IMAP+SMTP smoke test for Gmail (App Password)
// Usage: node email_test.js --list
//    or: node email_test.js --send --to you@example.com --subject "Test" --text "hello"

const dotenv = require('dotenv');
const { ImapFlow } = require('imapflow');
const nodemailer = require('nodemailer');

function getEnv(name) {
  const v = process.env[name];
  if (v && v.trim()) return v.trim();
  return '';
}

async function listUnread() {
  const user = getEnv('GMAIL_USER');
  const pass = getEnv('GMAIL_APP_PASSWORD');
  if (!user || !pass) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD. Put them in .env (preferred) or set ENV_PATH.');
  }

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass }
  });

  await client.connect();
  let lock;
  try {
    lock = await client.getMailboxLock('INBOX');
    const uids = await client.search({ seen: false });
    const last = uids.slice(-10);

    const results = [];
    for await (const msg of client.fetch(last, { envelope: true, flags: true })) {
      results.push({
        uid: msg.uid,
        date: msg.envelope?.date,
        from: msg.envelope?.from?.map(x => x.address).join(', '),
        subject: msg.envelope?.subject
      });
    }

    console.log(JSON.stringify({ unread: uids.length, last: results }, null, 2));
  } finally {
    if (lock) lock.release();
    await client.logout();
  }
}

async function sendMail({ to, subject, text }) {
  const user = getEnv('GMAIL_USER');
  const pass = getEnv('GMAIL_APP_PASSWORD');
  if (!user || !pass) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD. Put them in .env (preferred) or set ENV_PATH.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { minVersion: 'TLSv1.2' }
  });

  const info = await transporter.sendMail({
    from: user,
    to,
    subject,
    text
  });

  console.log(JSON.stringify({ accepted: info.accepted, rejected: info.rejected, messageId: info.messageId }, null, 2));
}

function parseArgs(argv) {
  const args = { list: false, send: false, to: '', subject: 'Test email', text: 'Hello from Clawdbot email test.' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') args.list = true;
    else if (a === '--send') args.send = true;
    else if (a === '--to') args.to = argv[++i] || '';
    else if (a === '--subject') args.subject = argv[++i] || '';
    else if (a === '--text') args.text = argv[++i] || '';
    else if (a === '--env') process.env.ENV_PATH = argv[++i] || '';
  }
  return args;
}

(async () => {
  const args = parseArgs(process.argv);
  // Load env AFTER parsing args so --env works
  dotenv.config({ path: process.env.ENV_PATH || '.env' });

  if (args.list) return listUnread();
  if (args.send) {
    if (!args.to) throw new Error('Missing --to');
    return sendMail(args);
  }
  console.error('Choose one: --list OR --send --to you@example.com');
  process.exit(1);
})().catch(err => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
