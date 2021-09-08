var fs = require('fs');

module.exports = function(app) {
    app.post('/api/fetchgroups',function(req,res){
        /*Fetch groups request will return the groups of a user based on their username
        and role (currently only returns all groups to all users/roles) */
        if (!req.body) {
            return res.sendStatus(400)
        }
        role = req.body.role;
        user.username = req.body.username;

        if(role == 'superadmin' || role == 'groupadmin' || role == 'user') {
            fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                if (err) throw err;
            groupdata = JSON.parse(data);
            groupdata = groupdata.groups;
            res.send({user: user, message: message, groupdata})
        });
        }
        
        //TEST code for trying to return specific groups for users/group assis
        /*else{
            fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                if (err) throw err;
                groupdata = JSON.parse(data);
                groups = [];
                groupsassis = [];
                console.log('is user');
                groupdata.groups.forEach(group => {
                    group.groupassis.forEach(groupassis => {
                        if(groupassis == user.username) {
                            console.log('isgroupassis')
                            groups.push(group);
                        }
                    });
                })

                /*groupdata.groups.forEach(group => {

                    for(i=0; i<group.channels.length; i++) {
                        if(group.channels[i].users.length !== 0) {
                            if(group.channels[i].users == user.username) {
                                for(y=0; y<groups.length; y++) {
                                    if(groups[y].groupname !== group.groupname) {
                                        groups.push({groupname: group.groupname})
                                        group.channels.forEach(channel => {
                                            if(channel.users == user.username) {
                                                groups.group.channels.push(channel)
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                }) 

                console.log(groups);
                groupdata = groups;
                res.send({user: user, message: message, groupdata})*/
   
})}