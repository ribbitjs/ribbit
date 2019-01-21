const express = require('express');
const app = express();

const path = require('path');

app.use(express.static(path.join(__dirname, '../dist/one.js')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/random.html'));
});

app.listen(2000, () => {
  console.log('listening on port 6000');
});
