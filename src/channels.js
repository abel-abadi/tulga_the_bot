let channels = [];
let ims = [];

function updateChannels(data) {
    if (data && data.channels) {
        channels = data.channels;
        console.log('channels.length', channels.length);
    }
}

function updateIMs(data) {
    ims = data.ims;
}

function getIMfromUID(uid) {
    const im = ims.find(i => i.user === uid);
    return im ? im.id : 'unknown IM channel';
}

function getChannelFromId(id) {
    const channel = channels.find(c => c.id === id);
    return channel ? channel.name : 'unknown channel';
}

function listChannels() {
    return channels;
}

module.exports = {
    listChannels,
    updateChannels,
    getChannelFromId,
    updateIMs,
    getIMfromUID
};
