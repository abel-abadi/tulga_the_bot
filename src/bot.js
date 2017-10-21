const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

if (process.env.NODE_ENV === 'development') { // eslint-disable-line no-undef
    require('dotenv').config();
}

const botToken = process.env.SLACK_BOT_TOKEN || ''; // eslint-disable-line no-undef

const rtm = new RtmClient(botToken);
const web = new WebClient(botToken);
module.exports = {rtm, web, RTM_EVENTS,CLIENT_EVENTS};
