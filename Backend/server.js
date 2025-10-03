const express = require('express');
const app = express();

app.use(express.json());
const port = 3000;

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

const aiRouter = require('./api/AI');
const dbRouter = require('./api/db');

app.use('/api/AI', aiRouter);
app.use('/api/db', dbRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
