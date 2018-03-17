const req = require('request');
const querystring = require('querystring');
const bot = require('../helpers/bot');
const key = require('../constants/keys');

const allUsers = [];
const loadBotUser = () => {
  const promise = new Promise((resolve) => {
    bot.getUsers()
      .then(result => result.members.filter(eachUser =>
        eachUser.is_bot === false && eachUser.id !== 'USLACKBOT'))
      .then(users => users.forEach((user) => {
        allUsers[user.id] = user.name;
      })).then(() => {
        resolve(allUsers);
      });
  });
  return promise;
};
bot.on('start', () => {
  loadBotUser();
});

const message = {
  text: 'Hey, you have been invited to join a party at @venue-here at @time-here',
  attachments: [
    {
      text: 'Would you like to join',
      fallback: "Shame... buttons aren't supported in this land",
      callback_id: 'button_tutorial',
      color: '#3AA3E3',
      attachment_type: 'default',
      actions: [
        {
          name: 'accept',
          text: 'Accept',
          type: 'button',
          value: 'eventidhere',
        },
        {
          name: 'reject',
          text: 'Reject',
          type: 'button',
          value: 'no',
        },
      ],
    },
  ],
};

module.exports = {
  method: 'POST',
  path: '/slackbot',
  handler: (request, response) => {
    console.log(request);

    const recipients = new Set(request.payload.text.split(/[ ]+/)
      .filter(e => e[0] === '@'));
    console.log(recipients, 'hey');
    const message = {
      text: request.payload.text,
      attachments: [
        {
          text: 'Would you like to join',
          fallback: "Shame... buttons aren't supported in this land",
          callback_id: 'button_tutorial',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'accept',
              text: 'Accept',
              type: 'button',
              value: 'eventidhere',
            },
            {
              name: 'reject',
              text: 'Reject',
              type: 'button',
              value: 'no',
            },
          ],
        },
      ],
    };
    // const messageStringify = JSON.stringify(message);
    const urlparam = {
      token: key,
      channel: '@vishalvasnani123',
      attachments: JSON.stringify(message),
      text: request.payload.text,
    };
    const qs = querystring.stringify(urlparam);
    console.log('here:::::::::', key);
    const path_to_call = `http://slack.com/api/chat.postMessage?${qs}`;
    req(path_to_call, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log('Success');
      } else {
        console.log(error);
      }
    });
    //  for (const id of recipients) {
    //	console.log(id.slice(1));
    //  bot.postMessageToUser(id.slice(1), message);
    // bot.postMessageToUser('vishalvasnani123', 'hi you are invited');
    response(message);
  // }
    // processMessage(request.payload.text);
    // response(message);
  },
};
const processMessage = (msg) => {
  const recipients = new Set(msg.split(/[ ]+/)
    .filter(e => e[0] === '@'));
  console.log(recipients, 'hey');
  for (const id of recipients) {
    console.log(id.slice(1));
    bot.postMessageToUser(id.slice(1), message);
    bot.postMessageToUser('vishalvasnani123', 'hi you are invited');
  }
};

