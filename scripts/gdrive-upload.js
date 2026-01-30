#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Paths - reuse existing OAuth setup
const KEYS_PATH = path.join(process.env.USERPROFILE, '.config', 'mcp-gdrive', 'gcp-oauth.keys.json');
const TOKENS_PATH = path.join(process.env.USERPROFILE, '.config', 'google-calendar', 'tokens.json');

async function getDrive() {
  const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  
  const oauth2Client = new google.auth.OAuth2(
    keys.installed.client_id,
    keys.installed.client_secret,
    'http://localhost:3456/callback'
  );
  oauth2Client.setCredentials(tokens);
  
  // Refresh token if needed
  oauth2Client.on('tokens', (newTokens) => {
    const updated = { ...tokens, ...newTokens };
    fs.writeFileSync(TOKENS_PATH, JSON.stringify(updated, null, 2));
  });
  
  return google.drive({ version: 'v3', auth: oauth2Client });
}

async function uploadFile(filePath, fileName, mimeType) {
  const drive = await getDrive();
  
  const fileMetadata = {
    name: fileName || path.basename(filePath),
  };
  
  const media = {
    mimeType: mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    body: fs.createReadStream(filePath),
  };
  
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink',
  });
  
  return res.data;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node gdrive-upload.js <filepath> [filename]');
    process.exit(1);
  }
  
  const filePath = args[0];
  const fileName = args[1] || path.basename(filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  
  console.log(`Uploading ${filePath} as "${fileName}"...`);
  
  try {
    const result = await uploadFile(filePath, fileName);
    console.log(`✅ Uploaded successfully!`);
    console.log(`   File ID: ${result.id}`);
    console.log(`   Name: ${result.name}`);
    console.log(`   Link: ${result.webViewLink}`);
  } catch (err) {
    console.error('Upload failed:', err.message);
    process.exit(1);
  }
}

main();
