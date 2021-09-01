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
            birthdate:String,
            age:Number,
            email:String,
            password:String,
            valid:Boolean
        };

        users = [ {username:'john52', birthdate:'22/2/1998', age:23, email:'john52@gmail.com', password:'abc123'}, 
        {username:'aimee52', birthdate:'02/10/2000', age:20, email:'aimee52@gmail.com', password:'123abc'},
        {username:'lachlan12', birthdate:'05/11/1997', age:23, email:'lachlan12@gmail.com', password:'password123'}
        ];

        
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