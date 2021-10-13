var express = require('express');
var app = express();

var path = require('path');

var cors = require('cors');
app.use(cors());

app.use(express.json());

app.use(express.static(__dirname + '/../dist/chatapp'));
console.log(__dirname);

let http = require('http');
const { connect } = require('http2');
let server = http.Server(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});


const PORT = 3000;

// sockets.connect(io, PORT);
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

io.on('connection', (socket) => {
    //console.log('user connection on port '+ PORT + ':' + socket.id);

    socket.on('join room', (connection)=> {
        socket.join(connection.location.groupname + connection.location.channelname);
        socket.to(connection.location.groupname + connection.location.channelname).emit('message', {username: 'System', message: connection.username + ' has joined the chat!'});
        MongoClient.connect(url, function(err, client) {
            let db = client.db(dbName);
            if (err) throw err;
            db.collection('chats').findOne({location: connection.location}, function(err, result){
                result.chatdata.push({username: 'System', message: connection.username + ' has joined the chat!'});
                db.collection('chats').updateOne({location: connection.location}, {$set: result}, function() {
                    client.close();
                })
            });
        });
    });

    socket.on('message', (chatData)=> {
        socket.to(chatData.location.groupname + chatData.location.channelname).emit('message', chatData.chatdata);
        MongoClient.connect(url, function(err, client) {
            let db = client.db(dbName);
            if (err) throw err;
            db.collection('chats').findOne({location: chatData.location}, function(err, result){
                result.chatdata.push(chatData.chatdata);
                db.collection('chats').updateOne({location: chatData.location}, {$set: result}, function() {
                    client.close();
                })
            });
        });
    });

    socket.on('leave', (disconnection)=> {
        socket.to(disconnection.location.groupname + disconnection.location.channelname).emit('message', {username: 'System', message: disconnection.username + ' has left the chat!'});
        MongoClient.connect(url, function(err, client) {
            let db = client.db(dbName);
            if (err) throw err;
            db.collection('chats').findOne({location: disconnection.location}, function(err, result){
                result.chatdata.push({username: 'System', message: disconnection.username + ' has left the chat!'});
                db.collection('chats').updateOne({location: disconnection.location}, {$set: result}, function() {
                    client.close();
                })
            });
        });
        socket.leave(disconnection.location.groupname + disconnection.location.channelname);
        socket.disconnect();
    });
});

// listen.listen(app, PORT);
serverexport = server.listen(PORT, () => {
    console.log('started on port:' +PORT);
});

module.exports = serverexport;



require('./app_modules/auth/auth.js')(app);
require('./app_modules/auth/fetchgroups.js')(app);
require('./app_modules/group/groupfunction.js')(app);
require('./app_modules/group/chatfunction.js')(app);
