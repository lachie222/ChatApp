const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

exports.insert = function(req, res) {
    MongoClient.connect(url, function(err, client) {
        let db = client.db(dbName);
        let content = req.body.content;
        let collection = doc.collection;
        console.log(req.body);
        if (err) throw err;
        db.collection(collection).find({_id: req.body._id}).toArray().then(function(content) {
            if (content.length > 0) {
                res.send({msg: 'Error, ID already exists'});
                client.close();
            }else {
                db.collection(collection).insertOne(content, function(err, result) {
                    console.log("Inserted the following document into the collection:" + content);
                    res.send(content);
                    client.close();
                })
            }
        })
    })
}