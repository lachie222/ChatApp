var User = require('../user/user.js');
var fs = require('fs');
var db = require('../dbOps/app');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

module.exports = function(app) {
    app.post('/api/auth',function(req,res){
        /*auth request checks request body which is an object containing a username and password*/
        if (!req.body) {
            return res.sendStatus(400)
        }

        username = req.body.username;
        password = req.body.password;
        query = {collection: 'users', query: {username: username, password: password}};

        async function processResult(query) {
            const result = await db.read(query);
            return console.log(result);
        };

        processResult(query);

        /*let collection = query.collection;
        let content = query.query;
        MongoClient.connect(url, function(err, client) {
            if (err) throw err;
            let db = client.db(dbName);
            console.log(query);
            db.collection(collection).findOne(content, function(err, result) {
                if (err) throw err; 
                if(result) {
                    if(content.username == result.username && content.password == result.password) {
                        console.log(result);
                        res.send({user:{id: result._id, username: result.username, role: result.role, valid: true}, message: 'Login Successful'})
                    };
                }else {
                    res.send({user:{valid: false}, message:'Username/password is incorrect'})
                }
                client.close();
            });
        });*/
    });

    app.post('/api/register',function(req,res){
        /* Register request will create a new user entry based on user email, username and password */
        if (!req.body) {
            return res.sendStatus(400)
        }
        if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
            user.email = req.body.email;
            user.username = req.body.username;
            user.password = req.body.password;
            validrequest = false;
    
           fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
               /*will check if req email or username is already taken, if so, return an error,
               if not, create the new user and store in storage */
                if (err) throw err;
                let userdata = JSON.parse(data);
                users = userdata.users;
                for (let i=0; i<users.length; i++){
                    if (user.username == users[i].username){
                        validrequest = false;
                        message = "Username already taken!";
                        res.send({message: message});
                        break;
                    }else if (user.email == users[i].email){
                        validrequest = false;
                        message = "Email already taken!";
                        res.send({message: message});
                        break;
                    }else {
                        validrequest = true;
                    }
                }
                if (validrequest == true) {
                    newuser = new User(user.username, user.password, user.email, '', 'user');
                    users.push(newuser);
                    fs.writeFileSync('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2));
                    //assignID();
                    message = 'Account Successfully Created';
                    res.send({message: message});
                }
            });
        }else {
            message = 'Incorrect Role!';
            res.send({message: message})
        }


    });

    app.post('/api/deleteacc',function(req,res){
        /* Delete request will delete a user based on req username */
        if (!req.body) {
            return res.sendStatus(400)
        }
        if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
            user.username = req.body.username;
    
           fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
               /*will check if user exists, and delete if they do, or send error if they don't */
                if (err) throw err;
                let userdata = JSON.parse(data);
                users = userdata.users;
                for (let i=0; i<users.length; i++){
                    if (user.username == users[i].username){
                        users.splice(i, 1);
                        fs.writeFileSync('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2));
                        //assignID();
                        message = "User deleted";
                        break;
                    }else{
                        message = "User does not exist";
                    }
                }
                res.send({message: message});
            });
        }else{
            message = 'Incorrect Role!';
            res.send({message: message})
        }


    });
    
}