var User = require('../user/user.js');
var fs = require('fs');

module.exports = function(app) {
    app.post('/api/auth',function(req,res){
        /*auth request checks request body which is an object containing a username and password*/
        if (!req.body) {
            return res.sendStatus(400)
        }
       fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
           /*If the request body username and password matches one found in userstorage,
           user will have a validated property and the remaining data will be sent back to the user, otherwise an error message will be sent */
            if (err) throw err;
            userdata = JSON.parse(data);
            users = userdata.users;
            username = req.body.username;
            password = req.body.password;
            user = {
                username:String,
                password:String,
                valid:Boolean
            };
        
            for (let i=0; i<users.length; i++){
                if (username == users[i].username && password == users[i].password){
                    user = users[i];
                    user.valid = true;
                    role = user.role;
                    message = "Successful Login";
                    res.send(JSON.stringify({message: message, user}))
                    break;
                }else{
                    user.valid = false;
                }
            };
    
            if (user.valid == false) {
                message = "Wrong username or Password";
                res.send({message: message, user: {valid: false}});
            }
        })
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
                    assignID();
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
                        assignID();
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

    function assignID() {
        /*Assign ID function will automatically assign an incrementing unique ID to each user in
        userstorage */
        fs.readFile('./app_modules/user/userstorage.json', (err,data) => {
            if(err) throw err;
            userdata = JSON.parse(data);
            users = userdata.users;
            for (i=0; i<users.length; i++){
                users[i].id = i;
            };
            fs.writeFileSync('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2));
        })
    }
    
}