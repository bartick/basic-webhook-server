const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.all('/webhook', (req, res) => {
    console.log('Webhook received:', req.method, req.body);
    console.log('Headers:', req.headers);
    console.log('Query Params:', req.query);
    res.status(200).send('Webhook received');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});