// Delete emails matching a search term
// Usage: node delete-emails.js "search term"

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

const searchTerm = process.argv[2] || 'Dext';

const imap = new Imap(imapConfig);

imap.once('ready', () => {
  imap.openBox('INBOX', false, (err, box) => {
    if (err) throw err;
    
    // Search for emails with the term in subject
    imap.search([['SUBJECT', searchTerm]], (err, results) => {
      if (err) throw err;
      
      if (!results || results.length === 0) {
        console.log('No emails found matching:', searchTerm);
        imap.end();
        return;
      }
      
      console.log(`Found ${results.length} emails matching "${searchTerm}"`);
      
      // Mark as deleted
      imap.addFlags(results, '\\Deleted', (err) => {
        if (err) throw err;
        
        // Expunge (permanently delete)
        imap.expunge((err) => {
          if (err) throw err;
          console.log(`Deleted ${results.length} emails`);
          imap.end();
        });
      });
    });
  });
});

imap.once('error', (err) => {
  console.error('IMAP error:', err);
});

imap.once('end', () => {
  console.log('Connection closed');
});

imap.connect();
