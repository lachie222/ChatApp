var fs = require('fs');
var groupchannels = require('./group.js');
var Group = groupchannels.Group;
var Channel = groupchannels.Channel;

module.exports = function(app) {
    //app parses in the express object needed to check credentials
    // it then checks the form request against an array of users, if a match is found it will
    // return customer.ok as true
    app.post('/api/creategroup',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            req.body.user = JSON.parse(req.body.user);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                newgroup = new Group(groupname);
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    if (err) throw err;
                    let groupdata = JSON.parse(data);
                    groupdata.groups.push(newgroup);
                    fs.writeFile('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2), (err)=> {
                        if (err) throw err;
                        message = "Group Successfully Created";
                        fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                            if (err) throw err;
                            groupdata = JSON.parse(data);
                            res.send({message: message, groupdata})
                        });
                    });
                })
            }else {
                message = {message:"Incorrect Role"}
                return res.send(message) 
            }
        }    
    });

    app.post('/api/removegroup',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            req.body.user = JSON.parse(req.body.user);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    if (err) throw err;
                    let groupdata = JSON.parse(data);
                    for(i=0; i<groupdata.groups.length; i++) {
                        if (groupdata.groups[i].groupname == groupname) {
                            groupdata.groups.splice(i, 1);
                        }
                    }
                    fs.writeFile('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2), (err)=> {
                        if (err) throw err;
                        message = "Group Successfully Deleted";
                        fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                            if (err) throw err;
                            groupdata = JSON.parse(data);
                            res.send({message: message, groupdata})
                        });
                    });
                })
            }else {
                message = {message:"Incorrect Role"}
                return res.send(message) 
            }
        }    
    });

    app.post('/api/createchannel',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            console.log(req.body);
            req.body.user = JSON.parse(req.body.user);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    if (err) throw err;
                    groupname = req.body.groupname;
                    channelname = req.body.channelname;
                    newchannel = new Channel(channelname);
                    groupdata = JSON.parse(data);
                    groupdata.groups.forEach(function(group) {
                        group = Object.assign(new Group(), group);
                        if (group.groupname == groupname) {
                            group.addChannel(newchannel)
                        };
                    });
                    fs.writeFileSync('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2));
                    message = "Channel Successfully Created";
                    fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                        if (err) throw err;
                        groupdata = JSON.parse(data);
                        res.send({message: message, groupdata})
                    });
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });

    app.post('/api/removechannel',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            console.log(req.body);
            req.body.user = JSON.parse(req.body.user);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    if (err) throw err;
                    groupname = req.body.groupname;
                    channelname = req.body.channelname;
                    groupdata = JSON.parse(data);
                    for(i=0; i<groupdata.groups.length; i++) {
                        if (groupdata.groups[i].groupname == groupname) {
                            for(x=0; x<groupdata.groups[i].channels.length; x++) {
                                if (groupdata.groups[i].channels[x].channelname == channelname) {
                                    groupdata.groups[i].channels.splice(x, 1);
                                }
                            };
                        }
                    }
                    fs.writeFileSync('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2));
                    message = "Channel Successfully Deleted";
                    fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                        if (err) throw err;
                        groupdata = JSON.parse(data);
                        res.send({message: message, groupdata})
                    });
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });

    app.post('/api/adduser',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            req.body.user = JSON.parse(req.body.user);
            console.log(req.body);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    if (err) throw err;
                    groupname = req.body.groupname;
                    channelname = req.body.channelname;
                    username = req.body.username;
                    groupdata = JSON.parse(data);
                    console.log(channelname);
                    for (i=0; i<groupdata.groups.length; i++) {
                        if (groupdata.groups[i].groupname == groupname ) {
                            console.log('group found');
                            for (x=0; x<groupdata.groups[i].channels.length; x++) {
                                if(groupdata.groups[i].channels[x].channelname == channelname) {
                                    console.log('channel found');
                                    groupdata.groups[i].channels[x] = Object.assign(new Channel(), groupdata.groups[i].channels[x]);
                                    groupdata.groups[i].channels[x].addUser(username);
                                }
                            }
                        }
                    }
                    fs.writeFileSync('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2));
                    message ="User Successfully Added";
                    fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                        if (err) throw err;
                        groupdata = JSON.parse(data);
                        res.send({message: message, groupdata})
                    });
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });

    app.post('/api/removeuser',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            req.body.user = JSON.parse(req.body.user);
            console.log(req.body);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    if (err) throw err;
                    groupname = req.body.groupname;
                    channelname = req.body.channelname;
                    username = req.body.username;
                    groupdata = JSON.parse(data);
                    console.log(channelname);
                    for (i=0; i<groupdata.groups.length; i++) {
                        if (groupdata.groups[i].groupname == groupname ) {
                            console.log('group found');
                            for (x=0; x<groupdata.groups[i].channels.length; x++) {
                                if(groupdata.groups[i].channels[x].channelname == channelname) {
                                    console.log('channel found');
                                    for(y=0; y<groupdata.groups[i].channels[x].users.length; y++) {
                                        if(groupdata.groups[i].channels[x].users[y] == username) {
                                            groupdata.groups[i].channels[x].users.splice(y, 1)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    fs.writeFileSync('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2));
                    message ="User Successfully Removed";
                    fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                        if (err) throw err;
                        groupdata = JSON.parse(data);
                        res.send({message: message, groupdata})
                    });
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });

    app.post('/api/promotesuper',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            req.body.user = JSON.parse(req.body.user);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                username = req.body.username;
                fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
                    if (err) throw err;
                    let userdata = JSON.parse(data);
                    for(i=0; i<userdata.users.length; i++) {
                        if (userdata.users[i].username == username) {
                            userdata.users[i].role = 'superadmin';
                        }
                    }
                    fs.writeFile('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2), (err)=> {
                        if (err) throw err;
                        message = "User Successfully Promoted to Superadmin!";
                        res.send({message: message})
                    });
                })
            }else {
                message = {message:"Incorrect Role"}
                return res.send(message) 
            }
        }    
    });

    app.post('/api/promotegroupadmin',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            req.body.user = JSON.parse(req.body.user);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                username = req.body.username;
                fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
                    if (err) throw err;
                    let userdata = JSON.parse(data);
                    for(i=0; i<userdata.users.length; i++) {
                        if (userdata.users[i].username == username) {
                            userdata.users[i].role = 'groupadmin';
                        }
                    }
                    fs.writeFile('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2), (err)=> {
                        if (err) throw err;
                        message = "User Successfully Promoted to Group Admin!";
                        res.send({message: message})
                    });
                })
            }else {
                message = {message:"Incorrect Role"}
                return res.send(message) 
            }
        }    
    });

    app.post('/api/promotegroupassis',function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            console.log(req.body);
            req.body.user = JSON.parse(req.body.user);
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    if (err) throw err;
                    groupname = req.body.groupname;
                    username = req.body.username;
                    groupdata = JSON.parse(data);
                    groupdata.groups.forEach(function(group) {
                        if (group.groupname == groupname) {
                            group.groupassis.push(username);
                        };
                    });
                    fs.writeFileSync('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2));
                    message = "Group Assis Successfully Created";
                    fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                        if (err) throw err;
                        groupdata = JSON.parse(data);
                        res.send({message: message, groupdata})
                    });
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });
    
}