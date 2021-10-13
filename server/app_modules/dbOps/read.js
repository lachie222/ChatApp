const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

exports.find = function(query) {
    return new Promise((resolve, reject) => {
        let collection = query.collection;
        let content = query.query;
        MongoClient.connect(url, function(err, client) {
            if (err) throw err;
            let db = client.db(dbName);
            console.log(query);
            db.collection(collection).find(content).toArray().then(function(docs) {
                //console.log(docs);
                return docs;
            }).catch((err) => {console.log(err);}).finally(() => {
                client.close();
            });
        });
    })

};