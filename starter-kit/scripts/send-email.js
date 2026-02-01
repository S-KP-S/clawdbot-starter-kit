// Send email via Gmail (quinn.strandholt@gmail.com)
// Usage: node send-email.js <to> <subject> <body> [--attach file1 file2 ...]

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')
  }
});

async function sendEmail(to, subject, body, options = {}) {
  const { html, attachments } = options;
  
  const mailOptions = {
    from: `"Quinn - Spencer's Assistant" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text: body,
    ...(html && { html }),
    ...(attachments && { attachments })
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email failed:', error.message);
    return { success: false, error: error.message };
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Find --attach flag
  const attachIndex = args.indexOf('--attach');
  let attachments = [];
  let mainArgs = args;
  
  if (attachIndex !== -1) {
    mainArgs = args.slice(0, attachIndex);
    const attachFiles = args.slice(attachIndex + 1);
    attachments = attachFiles.map(f => ({
      filename: path.basename(f),
      path: path.resolve(f)
    })).filter(a => fs.existsSync(a.path));
  }
  
  const [to, subject, ...bodyParts] = mainArgs;
  const body = bodyParts.join(' ');
  
  if (!to || !subject) {
    console.log('Usage: node send-email.js <to> <subject> <body> [--attach file1 file2 ...]');
    process.exit(1);
  }
  
  sendEmail(to, subject, body || '', { attachments: attachments.length ? attachments : undefined })
    .then(result => {
      process.exit(result.success ? 0 : 1);
    });
}

module.exports = { sendEmail };
