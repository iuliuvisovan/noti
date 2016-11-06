var express = require('express');
var app = express();
var server = app.listen(3000, () => console.log('Running on 3000!'));
var io = require('socket.io').listen(server);
var path = require('path');
var handler = require('./noti-handler');

app.use(express.static(path.join(__dirname, '/public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/notify', (req, res) => {
    handler.notify();
    res.send('Got it, i\'ll notify the guys in no time!');
});

handler.init(io);