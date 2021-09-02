var groupchannels = require('./group.js');
var Group = groupchannels.Group;

module.exports = function(app) {
    //app parses in the express object needed to check credentials
    // it then checks the form request against an array of users, if a match is found it will
    // return customer.ok as true
    app.post('/api/creategroup',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.role == 'superadmin' || req.body.role == 'groupadmin') {
                group = {
                    groupname:String
                };
                group.groupname = req.body.groupname;
                res.send(new Group(group.groupname));
            }else {
                error = "Incorrect Role"
                return res.send(error) 
            }
        }    
    });

}