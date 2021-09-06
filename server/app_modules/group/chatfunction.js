var Chat = require('./chat.js');

app.post('/api/createchat',function(req,res){
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
                fs.writeFileSync('./app_modules/group/groupstorage.json', JSON.stringify(groupdata, null, 2));
            })
            message = {message:"Successfully Created"}
            res.send(message);
        }else {
            message = {message:"Incorrect Role"}
            return res.send(message) 
        }
    }    
});