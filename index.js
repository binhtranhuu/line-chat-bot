'use strict';

import line from '@line/bot-sdk'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

// create LINE SDK client
const client = new line.Client(config);



app.get('/', (req, res) => {
  return res.status(200).send('Ok')
})

app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    console.log('events is: ', req.body.events);
    return events.length > 0 ? await events.map(event => handleEvent(event)) : res.status(200).send('Ok')
  } catch (error) {
    return res.status(500).end()
  }
});

// event handler
function handleEvent(event) {
  const eventType = event.type
  switch (eventType) {
    case 'message':
      handleSendMessage(event)
      break;
    case 'follow':
      handleUserFollow(event)
      break;
    default:
      return Promise.resolve(null);
  }
}

const handleSendMessage = (event) => {
  const eventTypeMessage = event.message.type
  switch (eventTypeMessage) {
    case 'text':
      handleSendMessageText(event)
      break;
    case 'image':
      handleSendMessageImage(event)
      break;
    default:
      return Promise.resolve(null);
  }
}

const handleSendMessageText = (event) => {
  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };
   // use reply API
  return client.replyMessage(event.replyToken, echo);
}

const handleSendMessageImage = (event) => {
  // create a echoing text message
  const echo = { type: 'text', text: 'You sent image' };
  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

const handleUserFollow = (event) => {
  // create a echoing text message
  const echo = { type: 'text', text: 'Welcome to WNC chat' };
  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
