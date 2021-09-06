var express = require('express');
var app = express();

var path = require('path');

var cors = require('cors');
app.use(cors());

app.use(express.json());

app.use(express.static(__dirname + '/../dist/chatapp'));
console.log(__dirname);

var http = require('http').Server(app);
var server = http.listen(3000, function() {
    console.log("Server listening on port: 3000")
});

require('./app_modules/auth/auth.js')(app);
require('./app_modules/group/groupfunction.js')(app);

var fs = require('fs');

newuser = {            
    "id": 5,
    "username": "aiden76",
    "password": "abc1236",
    "email": "aiden@gmail.com",
    "role": "user"
}

/*fs.readFile('./app_modules/user/userstorage.json', (err, data) => {
    if (err) throw err;
    let userdata = JSON.parse(data);
    userdata.users.push(newuser);
    fs.writeFileSync('./app_modules/user/userstorage.json', JSON.stringify(userdata, null, 2));
    ;
});*/