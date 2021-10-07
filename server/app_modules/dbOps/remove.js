const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

exports.delete = function(req, res) {
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        let db = client.db(dbName);
        let queryJSON = req.body.content;
        let collection = req.body.collection;
        db.collection(collection).deleteMany(queryJSON, function(err, result) {
            if (err) throw err;
            console.log("Removed the documents with: ", queryJSON);
            res.send(queryJSON);
            client.close()
        });
    });
};