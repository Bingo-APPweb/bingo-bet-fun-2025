// index.js
import './src/app/globals.css';
const functions = require('@google-cloud/functions-framework');

functions.http('helloWorld', (req, res) => {
  res.json({
    message: 'Hello from BingoAPP!',
  });
});
