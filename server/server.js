var express = require('express');
var app = express();

var path = require('path');

var cors = require('cors');
app.use(cors());

app.use(express.json());

app.use(express.static(__dirname + '/../dist/chatapp'));
console.log(__dirname);

let http = require('http');
let server = http.Server(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});


const PORT = 3000;

// sockets.connect(io, PORT);

io.on('connection', (socket) => {
    //console.log('user connection on port '+ PORT + ':' + socket.id);

    socket.on('join room', (username, roomName)=> {
        socket.join(roomName);
        //console.log('user has joined room'+ socket.id+ roomName);
        socket.to(roomName).emit('message', {username: 'System', message: username + ' has joined the chat!'});
    });

    socket.on('message', (message, roomName)=> {
        socket.to(roomName).emit('message', message);
    });

    socket.on('leave', (username, roomName)=> {
        //console.log(username + ' has left ' + roomName);
        socket.to(roomName).emit('message', {username: 'System', message: username + ' has left the chat!'});
        socket.leave(roomName);
        socket.disconnect();
    });
});
// listen.listen(app, PORT);
server.listen(PORT, () => {
    console.log('started on port:' +PORT);
});



require('./app_modules/auth/auth.js')(app);
require('./app_modules/auth/fetchgroups.js')(app);
require('./app_modules/group/groupfunction.js')(app);
require('./app_modules/group/chatfunction.js')(app);
