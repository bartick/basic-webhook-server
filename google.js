const { google } = require('googleapis');

async function watchCalendar(oauth2Client, webhookUrl) {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const res = await calendar.events.watch({
    calendarId: 'primary',
    requestBody: {
    //   id: 'unique-channel-id-' + Date.now(), // must be unique per channel
      id: 'channel-bartick-maiti',
      type: 'web_hook',
      address: webhookUrl, // your public HTTPS endpoint
    },
  });

  // log response
  console.log('Watch response:', res.data);
}

function deleteChannel(oauth2Client, channelId, resourceId) {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  calendar.channels.stop({
    requestBody: {
      id: channelId,
      resourceId: resourceId,
    },
  }, (err, res) => {
    if (err) {
      console.error('Error stopping channel:', err);
      return;
    }
    console.log('Channel stopped:', res.data);
  });
}

module.exports = {
    watchCalendar,
    deleteChannel
};