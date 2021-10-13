const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

module.exports = function(app) {
    app.post('/api/auth',function(req,res){
        /*auth request checks request body which is an object containing a username and password. Then queries the database using the request body. If a match is found, the query's username and password is compared, and if matched, the user and a success message is sent back*/
        if (!req.body) {
            return res.sendStatus(400)
        }

        username = req.body.username;
        password = req.body.password;
        query = {collection: 'users', query: {username: username, password: password}};

        let collection = query.collection;
        let content = query.query;
        MongoClient.connect(url, function(err, client) {
            if (err) throw err;
            let db = client.db(dbName);
            db.collection(collection).findOne(content, function(err, result) {
                if (err) throw err; 
                if(result) {
                    if(content.username == result.username && content.password == result.password) {
                        res.send({user:{id: result._id, username: result.username, role: result.role, valid: true}, message: 'Login Successful'})
                    };
                }else {
                    res.send({user:{valid: false}, message:'Username/password is incorrect'})
                }
                client.close();
            });
        });
    });

    app.post('/api/register',function(req,res){
        /* Register request will create a new user entry based on user email, username and password and store in the database. It will then send a message */
        if (!req.body) {
            return res.sendStatus(400)
        }
        if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
            email = req.body.email;
            username = req.body.username;
            password = req.body.password;
            query = {collection: 'users', query: {username: username, password: password, email: email, role:'user'}};

            MongoClient.connect(url, function(err, client) {
                let db = client.db(dbName);
                let content = query.query;
                let collection = query.collection;
                if (err) throw err;
                db.collection(collection).findOne({$or:[{email: content.email}, {username: content.username}]}, function(err, result){
                    if (result) {
                        if (result.email == content.email) {
                            if (err) throw err;
                            res.send({message: 'Error, email already exists!'});
                            client.close();
                        }else{
                            res.send({message: 'Error, username already exists!'})
                            client.close();
                        };

                    }else {db.collection(collection).insertOne(content, function(err) {
                        if (err) throw err;
                        res.send({message: 'User successfully created!'});
                        client.close();
                    })};
                });
            });
        }else {
            res.send({message: 'User is incorrect role!'})
        }
    });

    app.post('/api/deleteacc',function(req,res){
        /* Delete request will delete a user from the database based on req username and then send a message back */
        if (!req.body) {
            return res.sendStatus(400)
        }
        if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
            username = req.body.username;
            query = {collection: 'users', query: {username: username}};
            MongoClient.connect(url, function(err, client) {
                if (err) throw err;
                let db = client.db(dbName);
                let content = query.query;
                let collection = query.collection;
                db.collection(collection).deleteOne(content, function(err, result) {
                    if (err) throw err;
                    if(result.deletedCount > 0) {
                        res.send({message: 'User ' + content.username + ' was deleted!'});
                    }else{
                        res.send({message:'User ' + content.username + ' not found!'})
                    }
                    client.close()
                });
            });

        }else {
            res.send({message: 'user is incorrect role'})
        }


    });
    
}