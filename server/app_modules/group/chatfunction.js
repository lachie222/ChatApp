var Chat = require('./chat.js');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

module.exports = function(app) {
    app.post('/api/retrievechat',function(req,res){
        /*retrieve chat request will return the chat history of the requests location */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            location = req.body;
            MongoClient.connect(url, function(err, client) {
                if (err) throw err;
                let db = client.db(dbName);
                db.collection('chats').findOne({location}, function(err, result) {
                    res.send({message:"successfully found chatdata", chatdata: result.chatdata});
                    client.close();
                })
            });
        }   
    });
}
