// Check Gmail inbox for recent emails
// Usage: node check-email.js [limit] [search]

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imapConfig = {
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''),
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

async function checkEmail(limit = 5, searchCriteria = ['UNSEEN']) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);
        
        imap.search(searchCriteria, (err, results) => {
          if (err) return reject(err);
          if (!results || results.length === 0) {
            imap.end();
            return resolve([]);
          }

          const fetch = imap.fetch(results.slice(-limit), { bodies: '', markSeen: false });
          
          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) return;
                emails.push({
                  from: parsed.from?.text,
                  subject: parsed.subject,
                  date: parsed.date,
                  text: parsed.text?.substring(0, 2000),
                  attachments: parsed.attachments?.map(a => ({ filename: a.filename, size: a.size }))
                });
              });
            });
          });

          fetch.once('end', () => {
            setTimeout(() => {
              imap.end();
              resolve(emails);
            }, 1000);
          });
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

if (require.main === module) {
  const limit = parseInt(process.argv[2]) || 5;
  const searchType = process.argv[3] || 'ALL'; // ALL, UNSEEN, RECENT
  
  checkEmail(limit, [searchType])
    .then(emails => {
      console.log(JSON.stringify(emails, null, 2));
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { checkEmail };
