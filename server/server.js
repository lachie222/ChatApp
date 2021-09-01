var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

app.use(express.json());

app.use(express.static(__dirname + '/../dist/week4'));
console.log(__dirname);

var http = require('http').Server(app);
var server = http.listen(3000, function() {
    console.log("Server listening on port: 3000")
});

require('./app_modules/auth/auth.js')(app);
var group = require('./app_modules/group/group.js');
var User = require('./app_modules/user/user.js');
