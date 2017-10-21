const express = require('express');
const exphbs = require('express-handlebars');
const {commands} = require('../src/commands');
const {rtm, web, RTM_EVENTS,CLIENT_EVENTS} = require('../src/bot');
const { keyWords,responses} = require('../src/keywords');
const {listUsers,updateUsers, getUsernameFromId} = require('../src/users');
const {listChannels,updateChannels, getChannelFromId, updateIMs, getIMfromUID} = require('../src/channels');
const {giveResponse,getRandomResponse,giveUserOrder} = require('../src/responses');
const {getRandomInt} = require('../src/util');


const viewsPath = __dirname + '/public/views/';
const app = express();
app.set('views', viewsPath);
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: viewsPath + 'layouts/',
}));
app.set('view engine', '.hbs');

//app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })

/** Routes */
app.get('/', (req, res) => {
    res.render('index', {
        users: listUsers(),
        channels: listChannels(),
        commands
    })
    ;
});

//------------------------
if (process.env.NODE_ENV === 'development') { // eslint-disable-line no-undef
    require('dotenv').config();
}

let general_channel;
let botName;

rtm.on(RTM_EVENTS.MESSAGE , function handleRtmMessage(message) {

    if (message.type === 'message' && message.text) {
        const messageText = message.text.toLowerCase();
        const userName = getUsernameFromId(message.user);

        console.log(userName + ' said: ' +messageText);
        //if its dm with the bot no need to mention
        if(message.channel.toLowerCase().charAt(0) === 'd'){ // checking if its DM message this could break on different release, can be refactored to checking channel.info/group.info
            giveResponse(messageText,message)

        }else if(message.subtype && message.subtype === 'channel_join'){

            if(getChannelFromId(message.channel) === 'general'){
                console.log('new user joined')
                giveResponse('joined',message);
            }
            

        }else{ // on groups and channels need mentioning
            const splittedMsg = messageText.split(" "); //@tulga_the_bot command:
            
                if(splittedMsg.length == 3){ // @tulga_the_bot onboard @user
                    giveUserOrder(splittedMsg,message,botName);

                }else if(splittedMsg.length == 2){ //@tulga_the_bot command

                    const mention = splittedMsg[0];
                    const cmd = splittedMsg[1];

                    if(mention === botName.toLowerCase()){ // if mentioned and has a command with colon
                        const cmdFound = false;
                        console.log('bot mentioned');
                        commands.forEach(command => {
                            if (cmd.indexOf(command) > -1) {
                                cmdFound = true;
                                console.log('command found ' + command);
                                giveResponse(command,message)
                            }
                        });
                        if(!cmdFound){
                            const res = 'Hey <@'+ message.user +'>, Do you speak Javascript? I am native Javascript speaker. \n '
                            +'If you do, please teach me this weird language of yours. :smile:';
                            rtm.sendMessage(res, message.channel);
                        }    
                    }
                }
        }
        
    }
});

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='general') { general_channel = c.id }
    }
    botName = '<@' + rtmStartData.self.id + '>';
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  });
  
  // you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    console.log("connected!-----------------------------")
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

//--------------------------------------------------


/** Static Files */
app.use('/', express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('listening on port: %s', port); // eslint-disable-line no-console
});

module.exports = server;
