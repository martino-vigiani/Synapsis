require('dotenv').config();
const express = require('express');
const path = require('path');


const app = express();
const port = 3000;

async function main() {
    const dbRouter = require('./api/db');
    const aiRouter = require('./api/AI')

    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/assets', express.static(path.join(__dirname, '../assets')));

    app.use(express.json()); // Middleware to parse JSON bodies

    app.use('/api/AI', aiRouter);
    app.use('/api/db', dbRouter);

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.get('/api-testing', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

main().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
