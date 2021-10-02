var express = require('express');
var app = express();

var path = require('path');

var cors = require('cors');
app.use(cors());

app.use(express.json());

app.use(express.static(__dirname + '/../dist/chatapp'));
console.log(__dirname);

let http = require('http');
let server = http.Server(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});


const PORT = 3000;

// sockets.connect(io, PORT);

io.on('connection', (socket) => {
    console.log('user connection on port '+ PORT + ':' + socket.id);

    socket.on('message', (message)=> {
        io.emit('message', message);
    });

    socket.on('disconnect', ()=> {
        console.log('User has disconnected: ' + socket.id);
        socket.disconnect();
    })
});
// listen.listen(app, PORT);
server.listen(PORT, () => {
    console.log('started on port:' +PORT);
});



require('./app_modules/auth/auth.js')(app);
require('./app_modules/auth/fetchgroups.js')(app);
require('./app_modules/group/groupfunction.js')(app);
require('./app_modules/group/chatfunction.js')(app);
