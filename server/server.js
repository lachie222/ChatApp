var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/../dist/chatapp'));

//Uncomment seeder var to rebuild the database upon running server
var seeder = require('./dbSeeding/seed');

let http = require('http');
let server = http.Server(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});


const PORT = 3000;

//MongoDB connection to allow sockets to store chat data
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

io.on('connection', (socket) => {
    socket.on('join room', (connection)=> {
        /* Upon joining a room, socket will connect user to the room and emit that the user has joined to the room. It will also then store that data on the database  */
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
        /* Upon message, sockets will emit the message to the specified room and save to database */
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
        /*Upon leaving a room, socket will disconnect the user from room and sockets and emit a leave message to the room and save to database */
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

//Server will listen for http requests
serverexport = server.listen(PORT, () => {
    console.log('started on port:' +PORT);
});

module.exports = serverexport;

require('./app_modules/auth/auth.js')(app);
require('./app_modules/auth/fetchgroups.js')(app);
require('./app_modules/group/groupfunction.js')(app);
require('./app_modules/group/chatfunction.js')(app);
