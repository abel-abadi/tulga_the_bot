let users = [];

function getUsernameFromId(id) {
    const user = users.find(u => u.id === id);
    return user ? user.name : 'unknown member';
}

function getIdFromUsername(username) {
    const user = users.find(u => u.username === username);
    return user ? user.id : '0';
}

function updateUsers(data) {
    users = data.members;
    users.map(member => {
        swearJar[member.name] = 0;
    });
}

function listUsers() {
    return users;
}

module.exports = {
    listUsers,
    updateUsers,
    getUsernameFromId,
    getIdFromUsername
};
