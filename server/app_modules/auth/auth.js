var User = require('../user/user.js');
var fs = require('fs');

module.exports = function(app) {
    //app parses in the express object needed to check credentials
    // it then checks the form request against an array of users, if a match is found it will
    // return customer.ok as true
    app.post('/api/auth',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        console.log(req.body);
        
        user = {
            username:String,
            email:String,
            password:String,
            role:String,
            valid:Boolean
        };

       fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
            if (err) throw err;
            let userdata = JSON.parse(data);
            users = userdata.users;
            user.username = req.body.username;
            user.password = req.body.password;
        
            for (let i=0; i<users.length; i++){
                if (user.username == users[i].username && user.password == users[i].password){
                    user = users[i];
                    user.valid = true;
                    message = "Successful Login";
                    console.log("USER VALIDATED");
                    fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                        if (err) throw err;
                        groupdata = JSON.parse(data);
                        res.send({user: user, msg: message, groupdata})
                    });
                    break
                }else{
                    user.valid = false;
                }
            };
    
            if (user.valid == false) {
                console.log("USER INVALID");
                msg = "Wrong username or Password";
                res.send({msg: msg, user: {valid: false}});
            }


        })
    });

    app.post('/api/register',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        console.log(req.body);
        
        user = {
            username:String,
            email:String,
            password:String,
            role:String,
            valid:Boolean
        };

        user.email = req.body.email;
        user.username = req.body.username;
        user.password = req.body.password;
        let validrequest = false;

       fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
            if (err) throw err;
            let userdata = JSON.parse(data);
            users = userdata.users;
            for (let i=0; i<users.length; i++){
                if (user.username == users[i].username){
                    validrequest = false;
                    msg = {msg: "Username already taken!"};
                    res.send(msg);
                    break;
                }else if (user.email == users[i].email){
                    validrequest = false;
                    msg = {msg: "Email already taken!"}
                    res.send(msg);
                    break;
                }else {
                    validrequest = true;
                }
            }
            if (validrequest == true) {
                newuser = new User(user.username, user.password, user.email, '', 'user');
                users.push(newuser);
                fs.writeFileSync('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2));
                assignID();
                msg = {msg:'User Successfully Created, Please login'};
                res.send(msg);
            }
        });

    });

    function assignID() {
        fs.readFile('./app_modules/user/userstorage.json', (err,data) => {
            if(err) throw err;
            let userdata = JSON.parse(data);
            users = userdata.users;
            for (let i=0; i<users.length; i++){
                users[i].id = i;
            };
            fs.writeFileSync('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2));
        })
    }

    /*function returnUser(username) {
        let userreturn = {};
        fs.readFile('./app_modules/user/userstorage.json', (err,data) => {
            if(err) throw err;
            let userdata = JSON.parse(data);
            users = userdata.users;
            for (let i=0; i<users.length; i++) {
                console.log(username);
                console.log(users[i].username);
                if (username == users[i].username) {
                    users[i].valid = true;
                    console.log('match found');
                    userreturn = users[i];
                }
            }
        }); 
        return userreturn;
    }*/
    
}