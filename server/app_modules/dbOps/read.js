const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

exports.find = function(req, res) {
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        let db = client.db(dbName);
        let collection = req.body;
        db.collection(collection).find({}).toArray().then(function(docs) {
            console.log("Found the following records");
            console.log(docs);
            res.send(docs);
        }).catch((err) => {console.log(err);}).finally(() => {client.close();});
    });
};