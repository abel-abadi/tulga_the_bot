const {rtm, web, RTM_EVENTS} = require('./src/bot');
const {commands} = require('./src/commands');
const {keyWords,responses} = require('./src/keywords');
const {updateUsers, getUsernameFromId} = require('./src/users');
const {updateChannels, getChannelFromId, updateIMs, getIMfromUID} = require('./src/channels');


if (process.env.NODE_ENV === 'development') { // eslint-disable-line no-undef
    require('dotenv').config();
}

function giveHelp(command, message) {
    switch (command) {
        case 'hello:': {
            rtm.sendMessage('Hello! :)', message.channel);
            break;
        }
        case 'help:': {
            let allCommandsMsg = 'I tulga the bot! Here are all the things you can tell me to do. \n';
            allCommandsMsg += allCommands.reduce((a, b) => a + '\n' + b);
            const messageLocation = getIMfromUID(message.user);
            console.log('help', messageLocation);
            rtm.sendMessage(allCommandsMsg, messageLocation);
            break;
        }
        default:
            break;
    }
}

function giveResponse(command, message) {
    switch (command) {
        case 'kill:': {
            const res = 'Not now! Gotta help out you beautiful people, ' + getUsernameFromId(message.user) + '.';
            rtm.sendMessage(res, message.channel);
            break;
        }
        case 'punish:': {
            const res = 'You don\'t have the authority, ' + getUsernameFromId(message.user) + '.';
            rtm.sendMessage(res, message.channel);
            break;
        }
        case 'reward:': {
            const res = 'Oh wow, Thank you ' + getUsernameFromId(message.user) + '.';
            rtm.sendMessage(res, message.channel);
            break;
        }
        case 'onboard:': {
            const res = 'Hi there! Thank you for joining us. Please, '
            +'introduce yourself and you need to change your profile picture that shows your beautiful face.'
           ' Also join to #meow channel lots of fun staff in there. '
           'Okay, let me know if there is anything I can help you with'
           ' and enjoy, ' + getUsernameFromId(message.user) + '.';
            rtm.sendMessage(res, message.channel);
            break;
        }
        case 'profile:': {
            const res = 'Hi come on now, don\'t be shy! Change your profile pic ' + getUsernameFromId(message.user) + '.';
            rtm.sendMessage(res, message.channel);
            break;
        }
        default:
            break;
    }
}

function getRandomResponse(keyword, userName) {
    const resArray = responses[keyword];
    if (resArray && resArray.length > 0) {
        if (typeof resArray[0] === 'string') {
            return resArray[getRandomInt(0, resArray.length)].replace(/\{user}/, userName);
        }
    }
    return 'You should speak with @tulga, he is much smarter than I am.';
}

function getRandomInt(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
}


rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {

    if (message.type === 'message' && message.text) {
        const messageText = message.text.toLowerCase();
        const userName = getUsernameFromId(message.user);

        console.log(userName + ' said: ' + message.text);

        if (userName !== robotName) {

            if (message.text.indexOf(':') > -1) {  // check for commands
                console.log('found colon');
                commands.forEach(command => {
                    if (messageText.indexOf(command) > -1) {
                        console.log('found command ' + command);
                        // if (helpCommands.indexOf(command) > -1 && traits.goldenBoyStatus !== 'sleep') {
                        //     console.log('executing help command');
                        //     giveHelp(command, message);
                        // }
                        giveResponse(command,message)
                    }
                });
            }
        }
    }
});

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='general') { channel = c.id }
    }
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  });
  
  // you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    rtm.sendMessage("Still trying....!", channel);
});

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err); 
    } else {
        updateUsers(data);
    }
});

web.channels.list((err, data) => {
    if (err) {
        console.error('web.channels.list Error:', err); 
    } else {
        // console.log(data)
        updateChannels(data);
    }
});

web.im.list((err, data) => {
    if (err) {
        console.error('web.im.list Error:', err); 
    } else {
        updateChannels(updateIMs(data));
    }
});


rtm.start();