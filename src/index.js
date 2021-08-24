import env from 'dotenv';
env.config();
import databaseConnect from './config/db';

const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

app.event('app_home_opened', ({ event, say }) => {
  say(`Hello world, <@${event.user}>!`);
});
// The echo command simply echoes on command
app.command('/mario', async ({ ack, payload, context }) => {
  // Acknowledge command request
  ack();
  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_name,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Go ahead. Click it.',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Click me!',
            },
            action_id: 'button_abc',
          },
        },
      ],
      // Text in the notification
      text: 'Message from Test App',
    });
    console.log(result);
    console.log(result.message.blocks);
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // mongodb
  databaseConnect();

  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ mario app is running!');
})();
