const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);
var add = require("./add");
var read = require("./read");
var update = require("./update");
var remove = require("./remove");

exports.add = function(req, res) {
    add.insert(req, res)
;
}
exports.read = function(req, res) {
    read.find(req, res);
};

exports.update = function(req, res) {
    update.update(req, res);
};

exports.remove = function(req, res) {
    remove.delete(req, res);
}


/*client.connect(function(err) {
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    //db.dropCollection("products");
    /*db.createCollection("products", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });
});*/

