const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

var userSeed = require('./userstorage.json');
var groupSeed = require('./groupstorage.json');
var chatSeed = require('./chathistory.json');

users = userSeed.users;
groups = groupSeed.groups;
chats = chatSeed.chats;

/*Seeder file will drop the database and rebuild it using data stored initially from assignment 1 in JSON files*/

MongoClient.connect(url, function(err, client) {
    let db = client.db(dbName);
    if (err) throw err;
    db.dropDatabase();
});

MongoClient.connect(url, function(err, client) {
    let db = client.db(dbName);
    if (err) throw err;
    db.collection('users').insertMany(users, function(err, result) {
        if (err) throw err;
        client.close();
    })
});

MongoClient.connect(url, function(err, client) {
    let db = client.db(dbName);
    if (err) throw err;
    db.collection('groups').insertMany(groups, function(err, result) {
        if (err) throw err;
        client.close();
    })
});

MongoClient.connect(url, function(err, client) {
    let db = client.db(dbName);
    if (err) throw err;
    db.collection('chats').insertMany(chats, function(err, result) {
        if (err) throw err;
        client.close();
    })
});