const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

module.exports = function(app) {
    app.post('/api/fetchgroups',function(req,res){
        /*Fetch groups request will return the groups of a user based on their username
        and role (currently only returns all groups to all users/roles) */
        if (!req.body) {
            return res.sendStatus(400)
        }
        role = req.body.role;
        username = req.body.username;

        if(role == 'superadmin' || role == 'groupadmin' || role == 'user') {
            MongoClient.connect(url, function(err, client) {
                if (err) throw err;
                let db = client.db(dbName);
                db.collection('groups').find().toArray().then(function(docs) {
                    res.send({message:'success', groupdata: docs});
                }).catch((err) => {console.log(err);}).finally(() => {
                    client.close();
                });
            });
        };
    });
}