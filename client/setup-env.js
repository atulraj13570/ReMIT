const fs = require('fs');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  // Copy .env.example to .env
  fs.copyFileSync('.env.example', '.env');
  console.log('Created .env file. Please update it with your Firebase credentials.');
} else {
  console.log('.env file already exists. Please update it with your Firebase credentials.');
}
