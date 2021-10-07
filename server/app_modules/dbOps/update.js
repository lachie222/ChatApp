const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

exports.update = function(req, res) {
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        let db = client.db(dbName);
        let queryJSON = req.body.query;
        let updateJSON = req.body.update;
        let collection = req.body.collection;
        db.collection(colleciton).updateMany(queryJSON, {$set: updateJSON}, function(err, result) {
            console.log("for the documents with", queryJSON);
            console.log("SET: ", updateJSON);
            res.send(result);
        })
    });
};