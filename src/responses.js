const {rtm, web, RTM_EVENTS,CLIENT_EVENTS} = require('../src/bot');
const {listUsers,updateUsers, getUsernameFromId,getIdFromUsername} = require('../src/users');
const { keyWords,responses} = require('../src/keywords');
const {listChannels,updateChannels, getChannelFromId, updateIMs, getIMfromUID} = require('../src/channels');
const {getRandomInt} = require('../src/util');
const {commands} = require('../src/commands');

function giveResponse(command, message) {
    switch (command) {
        case 'help': {
            let allCommandsMsg = 'I am *tulga the bot*.\n'
            +'When direct messaging me, you don\'t have to mention my name we can talk using the following commands.\n'
            +'I would be able to watch out for new users joining our general channel and onboard them.\n'
            +'You can also ask me to remide someone to change their profile or onboard them simpley by typing \n *@tulga_the_bot profile @user*\n'
            +'And I would politely instruct them to do so.\n'
            +'_Here are all the things you can tell me to do._ :smile: \n';
            allCommandsMsg += '<@tulga_the_bot> command\n';
            allCommandsMsg += commands.reduce((a, b) => a + '\n' + b);
            const messageLocation = getIMfromUID(message.user);

            rtm.sendMessage(allCommandsMsg, message.channel);
            break;
        }
        case 'hello': {
            const res = 'HI, I am tulga the bot. Assistant *to* _the Regional onboarder_ Tulga';
            rtm.sendMessage(res, message.channel);
            break;
        }
        case 'hi': {
            const res = 'Hi to you too! <@' +message.user + '>';
            rtm.sendMessage(res, message.channel);
            break;
        }
        case 'joined': {
            const res = 'Hi <@' +message.user + '> !' +'Thank you for joining us. Please, '
           + 'introduce yourself and *you need to change your profile picture* that shows your _beautiful face_.\n'
           + ' Also join to *#meow* channel lots of cats in there. \n'
           + 'Let me know if there is anything I can help you with :smile:'
           + ' enjoy!';
            rtm.sendMessage(res, message.channel);
            break;
        }
        default:{
            const res = 'No idea what you just said! I am not that smart :smile: :slightly_frowning_face:';
            rtm.sendMessage(res, message.channel);
            break;
        }
            
    }
}

function giveUserOrder(arr,message,botName){
    if(arr.length == 3 && arr[0] === botName.toLowerCase()){

        
        const cmd = arr[1]; //command
        const mentionedUser = sanitize(arr[2]);

        switch (cmd) {
            case 'profile': {
                const res = 'Hey <@'+ mentionedUser +'>, come on now! \n Don\'t be shy, Change your profile pic';
                rtm.sendMessage(res, message.channel);
                break;
            }
            case 'onboard': {
                const res = 'Hello <@'+ mentionedUser +'>! You have started a great journey by joining us. Please, '
               + 'introduce yourself and *you need to change your profile picture* that shows your _beautiful face_.\n'
               + ' Also join to *#meow* channel if you haven\'t already, lots of fun there. \n'
               + 'Let me know if there is anything I can help you with :smile:'
               + ' enjoy!';
                rtm.sendMessage(res, message.channel);
                break;
            }
            default:{
                const res = 'Hey <@'+ mentionedUser +'>, Would you listen to <@'+ message.user +'>';
                rtm.sendMessage(res, message.channel);
                break;
            }
        }
    }
    // }else{
    //     const res = 'Hey <@'+ message.user +'>, Do you speak Javascript? I am native Javascript speaker. \n '
    //     +'If you do, please teach me this weird language of yours. :smile:';
    //     rtm.sendMessage(res, message.channel);
    //     break;
    // }
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

function sanitize(user){

    user = user.replace(/</g,'');
    user = user.replace(/>/g,'');
    user = user.replace(/@/g,'');

    return user.toUpperCase();
}

module.exports = {
    giveResponse,
    getRandomResponse,
    giveUserOrder
};