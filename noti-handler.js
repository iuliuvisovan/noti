// var sqlHandler = require('./sql-handler');
var clients = [];
var channel;

module.exports = {
    init: (io) => io.on('connection', (client) => {
        clients.push({
            socketId: client.id
        });
        client.on('check-in', (token) => λ(client).growzerData = destructure(token));
        client.on('disconnect', () => delete λ(client));
    }) && (channel = io),
    notify: () => channel.emit('noti', JSON.stringify(mockNoti))
}

var mockNoti = [{
    title: "New notification 1",
    date: new Date(),
    text: "Hey mate, you just received a new notification!"
}, {
    title: "New notification 2",
    date: new Date(),
    text: "Hey mate, you just received a new notification!"
}, {
    title: "New notification 3",
    date: new Date(),
    text: "Hey mate, you just received a new notification!"
}, ]

var λ = (socket) => clients.find(x => x.socketId == socket.id);

var destructure = (token) => {
    token = token.split("").reverse().join("");
    return {
        userId: token.slice(0, token.indexOf('/')),
        locations: token.slice(token.indexOf('/') + 1, token.lastIndexOf('/')).split(','),
        customerId: token.slice(token.lastIndexOf('/') + 1)
    }
}