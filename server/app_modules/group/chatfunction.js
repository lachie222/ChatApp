var Chat = require('./chat.js');
var fs = require('fs');

module.exports = function(app) {
    app.post('/api/createchat',function(req,res){
        /*create chat request will create a new chat object and store in chathistory storage */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            req.body.user = JSON.parse(req.body.user);
            username = req.body.user.username;
            location = {groupname: req.body.groupname, channelname: req.body.channelname};
            chatmessage = req.body.message;
            fs.readFile('./app_modules/group/chathistory.json', (err, data) => {
                /*will match location of chat request to location of chat object in storage,
                then will run addMessage function to the located chat object to parse a new message into the chat objects chat history */
                if (err) throw err;
                chatdata = JSON.parse(data);
                chatdata.chats.forEach(chat => {
                    if(chat.location.groupname == location.groupname && chat.location.channelname == location.channelname) {
                        chat = Object.assign(new Chat(), chat);
                        chat.addMessage(username, chatmessage)
                        fs.writeFileSync('./app_modules/group/chathistory.json', JSON.stringify(chatdata, null, 2));
                        message = {message:"Message Successfully Created"}
                        res.send(message);
                    }
                });
            }); 
        }   
    });

    app.post('/api/retrievechat',function(req,res){
        /*retrieve chat request will return the chat history of the requests location */
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            location = {groupname: req.body.groupname, channelname: req.body.channelname};
            fs.readFile('./app_modules/group/chathistory.json', (err, data) => {
                /*will check chat history and match the location of the request to the chat object in storage and return it */
                if (err) throw err;
                chatdata = JSON.parse(data);
                for(i=0; i<chatdata.chats.length; i++) {
                    if(chatdata.chats[i].location.groupname == location.groupname && chatdata.chats[i].location.channelname == location.channelname) {
                        message = "Chat room successfully joined";
                        res.send({message: message, chatdata: chatdata.chats[i].chatdata});
                    }
                }
            }); 
        }   
    });
}
