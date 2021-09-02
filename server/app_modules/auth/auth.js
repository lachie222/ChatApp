var User = require('../user/user.js');

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

        superuser = new User('john52', 'abc123', 'john52@gmail.com', 1, 'superadmin');

        adminuser = new User('aimee52', 'abc1234', 'john52@gmail.com', 2, 'groupadmin');

        groupassis = new User('ben88', 'abc1235', 'john52@gmail.com', 3, 'groupassis');

        standarduser = new User('mike22', 'abc1236', 'john52@gmail.com', 4, 'user');

        users = [];
        users.push(superuser, adminuser, groupassis, standarduser);

        
        user.username = req.body.username;
        user.password = req.body.password;
    
        for (let i=0; i<users.length; i++){
            if (user.username == users[i].username && user.password == users[i].password){
                user = users[i];
                user.valid = true;
                console.log("USER VALIDATED");
                res.send(user)
                break
            }else{
                user.valid = false;
            }
        };

        if (user.valid == false) {
            console.log("USER INVALID");
            res.send(user)
        }
    });
}