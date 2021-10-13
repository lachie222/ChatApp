var fs = require('fs');
var groupchannels = require('./group.js');
var Chat = require('./chat.js');
var Group = groupchannels.Group;
var Channel = groupchannels.Channel;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

module.exports = function(app) {
    app.post('/api/creategroup',function(req,res){
        /*create group request will create a new group based on
        request params and store in groupstorage */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                newgroup = new Group(groupname);
                query = {collection: 'groups', query: newgroup};
                MongoClient.connect(url, function(err, client) {
                    let db = client.db(dbName);
                    let content = query.query;
                    let collection = query.collection;
                    console.log(req.body);
                    if (err) throw err;
                    db.collection(collection).findOne({groupname: content.groupname}, function(err, result){
                        if (result) {
                            res.send({message: 'Error, group already exists!'});
                            client.close();
                        }else {
                            db.collection(collection).insertOne(content, function(err) {
                            if (err) throw err;
                            res.send({message: 'Group successfully created!'});
                            client.close();
                        })};
                    });
                });
            }else {
                message = {message:"Incorrect Role"}
                return res.send(message) 
            }
        }    
    });

    app.post('/api/removegroup',function(req,res){
        /*Remove group request will remove a group based on request params,
        and then update group storage */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                query = {collection: 'groups', query: {groupname: groupname}};
                MongoClient.connect(url, function(err, client) {
                    if (err) throw err;
                    let db = client.db(dbName);
                    let content = query.query;
                    let collection = query.collection;
                    db.collection(collection).deleteOne(content, function(err, result) {
                        if (err) throw err;
                        if(result.deletedCount > 0) {
                            res.send({message: 'Group ' + content.groupname + ' was deleted!'});
                        }else{
                            res.send({message:'Group ' + content.groupname + ' not found!'})
                        }
                        client.close()
                    });
                });
            }else {
                message = {message:"Incorrect Role"}
                return res.send(message) 
            }
        }    
    });

    app.post('/api/createchannel',function(req,res){
        /*create channel request will create a new channel based on req params,
        and then update storage */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                channelname = req.body.channelname;
                newchannel = new Channel(channelname);
                query = {collection: 'groups', query:{groupname: groupname}}
                MongoClient.connect(url, function(err, client) {
                    let db = client.db(dbName);
                    let content = query.query;
                    let collection = query.collection;
                    if (err) throw err;
                    db.collection(collection).findOne({groupname: content.groupname}, function(err, result){
                        if (result) {
                            channelfound = false;
                            for (i=0; i<result.channels.length; i++) {
                                channelfound = false;
                                if(result.channels[i].channelname == channelname) {
                                    res.send({message: 'Error, channel already exists!'});
                                    client.close();
                                    channelfound = true;
                                    break;
                                }
                            }
                            if (channelfound == false) {
                                result.channels.push(newchannel);
                                db.collection(collection).updateOne({groupname: groupname}, {$set: result}, function(err, result) {
                                    res.send({message: 'Channel created!'});
                                    client.close();
                                })
                            }
                        }else {
                            res.send({message: 'Group not found!'});
                            client.close();
                        };
                    });
                });
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });

    app.post('/api/removechannel',function(req,res){
        /*Remove channel request will remove a channel based on req params,
        and then update storage */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                channelname = req.body.channelname;
                query = {collection: 'groups', query:{groupname: groupname}}
                MongoClient.connect(url, function(err, client) {
                    let db = client.db(dbName);
                    let content = query.query;
                    let collection = query.collection;
                    if (err) throw err;
                    db.collection(collection).findOne({groupname: content.groupname}, function(err, result){
                        if (result) {
                            channelfound = false;
                            for (i=0; i<result.channels.length; i++) {
                                if(result.channels[i].channelname == channelname) {
                                    result.channels.splice(i, 1);
                                    db.collection(collection).updateOne({groupname: groupname}, {$set: result}, function(err, result) {
                                        res.send({message: 'Channel successfully deleted!'});
                                        client.close();
                                    });
                                    channelfound = true;
                                    break;
                                };
                            };
                            if (channelfound == false) {
                                res.send({message: 'Channel not found'});
                                client.close();
                            };
                        }else {
                            res.send({message: 'Group not found!'});
                            client.close();
                        };
                    });
                });

            }else {
                res.send({message:"Incorrect Role"}); 
            }
        }    
    });

    app.post('/api/adduser',function(req,res){
        /*adduser request will add a username to a req group/channel combo */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    /*will search through group storage and match groups/channel names,
                    then will run addUser method to add a username into the channel,
                    then update storage */
                    if (err) throw err;
                    groupname = req.body.groupname;
                    channelname = req.body.channelname;
                    username = req.body.username;
                    groupdata = JSON.parse(data);
                    for (i=0; i<groupdata.groups.length; i++) {
                        if (groupdata.groups[i].groupname == groupname ) {
                            for (x=0; x<groupdata.groups[i].channels.length; x++) {
                                if(groupdata.groups[i].channels[x].channelname == channelname) {
                                    groupdata.groups[i].channels[x] = Object.assign(new Channel(), groupdata.groups[i].channels[x]);
                                    groupdata.groups[i].channels[x].addUser(username);
                                }
                            }
                        }
                    }
                    fs.writeFileSync('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2));
                    message ="User Successfully Added";
                    res.send({message: message})
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });

    app.post('/api/removeuser',function(req,res){
        /*Remove user request will remove a user from req specified group/channel combo */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    /* will search through groupstorage to find channel/group combo and then
                    find the user and remove it from the channel/group combo,
                    then update storage */
                    if (err) throw err;
                    groupname = req.body.groupname;
                    channelname = req.body.channelname;
                    username = req.body.username;
                    groupdata = JSON.parse(data);
                    for (i=0; i<groupdata.groups.length; i++) {
                        if (groupdata.groups[i].groupname == groupname ) {
                            for (x=0; x<groupdata.groups[i].channels.length; x++) {
                                if(groupdata.groups[i].channels[x].channelname == channelname) {
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
                    res.send({message: message});
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });

    app.post('/api/promotesuper',function(req,res){
        /*Promote super request will update a requested users role to superadmin */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin') {
                username = req.body.username;
                fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
                    /*Search for req username in userstorage and change their role to superadmin,
                    then update storage */
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
        /*promote group admin will update a req users role to groupadmin */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                username = req.body.username;
                fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
                    /* Searches through user storage to find user, then update their
                    role to groupadmin */
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
        /* promote group assis will add a req username to the groupass array of a req group*/
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                fs.readFile('./app_modules/group/groupstorage.json', (err, data) => {
                    /*will locate requested group and push username into groupassis array */
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
                    res.send({message: message});
                })
            }else {
                message = {message:"Incorrect Role"};
                return res.send(message); 
            }
        }    
    });
    
}