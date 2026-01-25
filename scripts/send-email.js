// Send email via Gmail (quinn.strandholt@gmail.com)
// Usage: node send-email.js <to> <subject> <body>

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '') // Remove spaces from app password
  }
});

async function sendEmail(to, subject, body, html = null) {
  const mailOptions = {
    from: `"Quinn - Spencer's Assistant" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text: body,
    ...(html && { html })
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
  const [,, to, subject, ...bodyParts] = process.argv;
  const body = bodyParts.join(' ');
  
  if (!to || !subject || !body) {
    console.log('Usage: node send-email.js <to> <subject> <body>');
    process.exit(1);
  }
  
  sendEmail(to, subject, body).then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { sendEmail };
