const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/webhook', (req, res) => {
    console.log('Header:', JSON.stringify(req.headers, null, 2));
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));
    console.log('Query Params:', JSON.stringify(req.query, null, 2));
    res.status(200).send('Webhook received');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});