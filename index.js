const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const {
    watchCalendar,
    deleteChannel
} = require('./google');

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

app.get('/slack', (req, res) => {
    console.log('Query Params:', JSON.stringify(req.query, null, 2));
    res.status(200).send('Slack endpoint hit');
});

app.get('/slack/get', (req, res) => {
    axios.get(`http://localhost:8010/anonymous/v1/slack/auth?code=${req.query.code}&state=${req.query.state}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error('Error fetching Slack auth:', error);
            res.status(500).send('Error fetching Slack auth');
        });
});

const {
    CLIENT_ID,
    SECRET_ID,
    REDIRECT_URI
} = require('./config');

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  SECRET_ID,
  REDIRECT_URI
);

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  console.log('Upcoming events:', JSON.stringify(events.data, null, 2));

  const eventList = events.data.items.map(event => {
    const start = event.start.dateTime || event.start.date;
    return `<li>${start} - ${event.summary}</li>`;
  }).join('');

  watchCalendar(oauth2Client, 'https://ringover.bartick.me/webhook');

  res.send(`<h1>Upcoming Events</h1><ul>${eventList}</ul>`);
});

app.get('/stop', (req, res) => {
    const channelId = req.query.channelId;
    const resourceId = req.query.resourceId;

    deleteChannel(oauth2Client, channelId, resourceId);
    res.send('Channel deletion requested');
});