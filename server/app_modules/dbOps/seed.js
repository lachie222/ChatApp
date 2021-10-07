const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

var userSeed = require('../user/userstorage.json');
var groupSeed = require('../group/groupstorage.json');
var chatSeed = require('../group/chathistory.json');

users = userSeed.users;
groups = groupSeed.groups;
chats = chatSeed.chats;

MongoClient.connect(url, function(err, client) {
    let db = client.db(dbName);
    if (err) throw err;
    db.collection('users').insertMany(users, function(err, result) {
        if (err) throw err;
        console.log("Inserted the following document into the collection:" + users);
        client.close();
    })
});

MongoClient.connect(url, function(err, client) {
    let db = client.db(dbName);
    if (err) throw err;
    db.collection('groups').insertMany(groups, function(err, result) {
        if (err) throw err;
        console.log("Inserted the following document into the collection:" + users);
        client.close();
    })
});

MongoClient.connect(url, function(err, client) {
    let db = client.db(dbName);
    if (err) throw err;
    db.collection('chats').insertMany(chats, function(err, result) {
        if (err) throw err;
        console.log("Inserted the following document into the collection:" + users);
        client.close();
    })
});