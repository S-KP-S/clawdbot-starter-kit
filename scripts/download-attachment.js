// Download email attachment
// Usage: node download-attachment.js <subject-search> <filename>

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

const imapConfig = {
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''),
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

async function downloadAttachment(subjectSearch, filename, outputDir = '.') {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);
        
        imap.search([['SUBJECT', subjectSearch]], (err, results) => {
          if (err) return reject(err);
          if (!results || results.length === 0) {
            imap.end();
            return resolve({ found: false, message: 'No matching emails found' });
          }

          const fetch = imap.fetch(results.slice(-1), { bodies: '', struct: true });
          
          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) return;
                
                if (parsed.attachments && parsed.attachments.length > 0) {
                  for (const att of parsed.attachments) {
                    if (!filename || att.filename === filename) {
                      const outPath = path.join(outputDir, att.filename);
                      fs.writeFileSync(outPath, att.content);
                      console.log(JSON.stringify({ 
                        success: true, 
                        filename: att.filename, 
                        path: outPath,
                        size: att.size
                      }));
                    }
                  }
                }
              });
            });
          });

          fetch.once('end', () => {
            setTimeout(() => {
              imap.end();
              resolve({ success: true });
            }, 2000);
          });
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

if (require.main === module) {
  const [,, subjectSearch, filename] = process.argv;
  const outputDir = process.argv[4] || 'C:\\Users\\spenc\\clawd\\skills\\ralph-loop';
  
  if (!subjectSearch) {
    console.log('Usage: node download-attachment.js <subject-search> [filename] [output-dir]');
    process.exit(1);
  }

  // Create output dir if needed
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  downloadAttachment(subjectSearch, filename, outputDir)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { downloadAttachment };
