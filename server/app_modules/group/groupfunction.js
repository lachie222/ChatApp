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
                                    chat = new Chat(groupname, channelname);
                                    db.collection('chats').insertOne(chat, function(){
                                        client.close();
                                    });
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
                                    db.collection(collection).updateOne({groupname: content.groupname}, {$set: result}, function(err, result) {
                                        res.send({message: 'Channel successfully deleted!'});
                                        chat = new Chat(groupname, channelname);
                                        db.collection('chats').deleteOne(chat, function(){
                                            client.close();
                                        });
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
                    /*will search through group storage and match groups/channel names,
                    then will run addUser method to add a username into the channel,
                    then update storage */
                    groupname = req.body.groupname;
                    channelname = req.body.channelname;
                    username = req.body.username;
                    query = {collection: 'groups', query:{groupname: groupname}}
                    MongoClient.connect(url, function(err, client) {
                        let db = client.db(dbName);
                        let content = query.query;
                        let collection = query.collection;
                        if (err) throw err;
                        db.collection(collection).findOne({groupname: content.groupname}, function(err, result){
                            if (result) {
                                channelfound = false;
                                userfound = false;
                                for (i=0; i<result.channels.length; i++) {
                                    if(result.channels[i].channelname == channelname) {
                                        for(x=0; x<result.channels[i].users.length; x++){
                                            if(result.channels[i].users[x] == username){
                                                res.send({message: 'User already added'});
                                                client.close();
                                                userfound = true;
                                                break;
                                            }
                                        }
                                        if(userfound == false) {
                                            result.channels[i].users.push(username);
                                            db.collection(collection).updateOne({groupname: content.groupname}, {$set: result}, function(){
                                                res.send({message: 'User successfully added'});
                                                client.close();
                                            })
                                        }
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
                res.send({message:"Incorrect Role!"}); 
            }
        }    
    });

    app.post('/api/removeuser',function(req,res){
        /*Remove user request will remove a user from req specified group/channel combo */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                channelname = req.body.channelname;
                username = req.body.username;
                query = {collection: 'groups', query:{groupname: groupname}}
                MongoClient.connect(url, function(err, client) {
                    let db = client.db(dbName);
                    let content = query.query;
                    let collection = query.collection;
                    if (err) throw err;
                    db.collection(collection).findOne({groupname: content.groupname}, function(err, result){
                        if (result) {
                            channelfound = false;
                            userfound = false;
                            for (i=0; i<result.channels.length; i++) {
                                if(result.channels[i].channelname == channelname) {
                                    for(x=0; x<result.channels[i].users.length; x++){
                                        if(result.channels[i].users[x] == username){
                                            result.channels[i].users.splice(x, 1);
                                            db.collection(collection).updateOne({groupname: content.groupname}, {$set: result}, function(){
                                                res.send({message: 'User successfully removed'});
                                                client.close();
                                            })
                                            userfound = true;
                                            break;
                                        }
                                    }
                                    if(userfound == false) {
                                        res.send({message: 'User was not found'});
                                        client.close();
                                    }
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
                res.send({message:"Incorrect Role!"}); 
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
                MongoClient.connect(url, function(err, client) {
                    let db = client.db(dbName);
                    if (err) throw err;
                    db.collection('users').updateOne({username: username}, {$set: {role:'superadmin'}}, function(err, result){
                        if (result.modifiedCount > 0) {
                            res.send({message:'User promoted to superadmin!'})
                            client.close();
                        }else if(result.matchedCount > 0){
                            res.send({message:"User is already a superadmin!"});
                            client.close();
                        }else{
                            res.send({message:"User not found!"});
                            client.close();
                        }
                    });
                });
            }else {
                res.send({message:'Incorrect Role!'})
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
                MongoClient.connect(url, function(err, client) {
                    let db = client.db(dbName);
                    if (err) throw err;
                    db.collection('users').findOne({username: username}, function(err, result) {
                        if(result){
                            if(result.role == 'superadmin'){
                                res.send({message:"Can't demote superadmin"});
                                client.close();
                            }else if(result.role == 'groupadmin') {
                                res.send({message:"User is already group admin"});
                                client.close();
                            }else{
                                db.collection('users').updateOne({username: username}, {$set: {role:'groupadmin'}}, function(err, result) {
                                    res.send({message:'User promoted to groupadmin!'});
                                    client.close();
                                })
                            }
                        }else{
                            res.send({message:"User not found!"});
                            client.close();
                        }
                    })
                });
            }else {
                res.send({message:"Incorrect Role"});
            }
        }    
    });

    app.post('/api/promotegroupassis',function(req,res){
        /* promote group assis will add a req username to the groupass array of a req group*/
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            if (req.body.user.role == 'superadmin' || req.body.user.role == 'groupadmin') {
                groupname = req.body.groupname;
                username = req.body.username;
                query = {collection: 'groups', query:{groupname: groupname}};
                MongoClient.connect(url, function(err, client) {
                    let db = client.db(dbName);
                    let content = query.query;
                    let collection = query.collection;
                    if (err) throw err;
                    db.collection(collection).findOne({groupname: content.groupname}, function(err, result){
                        if (result) {
                            foundgroupassis = false;
                            for(i=0; i<result.groupassis.length; i++) {
                                if(result.groupassis[i] == username) {
                                    res.send({message:"User is already groupassis of that group!"});
                                    client.close();
                                    foundgroupassis = true;
                                    break;
                                }
                            };
                            if(foundgroupassis == false){
                                result.groupassis.push(username);
                                db.collection(collection).updateOne({groupname: content.groupname},{$set: result}, function(err, result){
                                    res.send({message:"User successfully added as groupassis"});
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
                res.send({message:"Incorrect Role"}); 
            }
        }    
    });
    
}