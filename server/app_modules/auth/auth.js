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
            let userdata = JSON.parse(data);
            users = userdata.users;
            username = req.body.username;
            password = req.body.password;
        
            for (let i=0; i<users.length; i++){
                if (username == users[i].username && password == users[i].password){
                    user = users[i];
                    user.valid = true;
                    role = user.role;
                    message = "Successful Login";
                    res.send({message: message, user})
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
        /*Assign ID function will automatically assign an incrementing unique ID to each user in
        userstorage */
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
    
}