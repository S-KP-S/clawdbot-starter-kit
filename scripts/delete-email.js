// Delete email from Gmail inbox by subject match
// Usage: node delete-email.js "subject to match"

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Imap = require('imap');

const imapConfig = {
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''),
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

async function deleteBySubject(subjectMatch) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);
        
        imap.search([['SUBJECT', subjectMatch]], (err, results) => {
          if (err) return reject(err);
          if (!results || results.length === 0) {
            imap.end();
            return resolve({ deleted: 0, message: 'No matching emails found' });
          }

          imap.addFlags(results, ['\\Deleted'], (err) => {
            if (err) return reject(err);
            
            imap.expunge((err) => {
              if (err) return reject(err);
              imap.end();
              resolve({ deleted: results.length, message: `Deleted ${results.length} email(s)` });
            });
          });
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

if (require.main === module) {
  const subject = process.argv[2];
  
  if (!subject) {
    console.error('Usage: node delete-email.js "subject to match"');
    process.exit(1);
  }
  
  deleteBySubject(subject)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { deleteBySubject };
