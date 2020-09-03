'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Page = require('./models/page');
const User = require('./models/users');
const fs = require('fs');
const hbs = require('express-handlebars');
const config = require('./config/config');
const server = require('http').Server(app);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const io = require('socket.io')(server);
const socketListener = require('./modules/socketListener')(io);
const session = require('express-session')(
    {
        secret: '5hhhhh d0 n0t t311 any0n3 0ur s3cr3t',
        resave: true,
        saveUninitialized: false
});

//shares the session with socket
const sharedsession = require("express-socket.io-session");
io.use(sharedsession(session, {
    autoSave:true
}));

//socket authentication middleware
//How it works: user connects to socket with zero permissions, then socket runs authenticate, if authenticated give permissions.
const socketAuth = require('socketio-auth')(io, {
    //authentication function
    authenticate: function (socket, data, callback) {
        //if you want to send this function a json object you can look at main where socket is handled, the you can get it from data. ie data.obj
        console.log('authenticating users permissions');
        var page_id = socket.handshake.headers.referer.slice(-5);
        var username = 'guest';

        //express session stores passport{user: 'username}
        if(socket.handshake.session.passport){
            username = socket.handshake.session.passport.user;
        }
        //look in db to see if user can edit the page
        Page.findOne({page_id: page_id, editors: {$in:[username, 'guest']}}, function(err, page){
            if (err || !page){
                return callback(new Error("Permission not found"));
            }else{
                return callback(null, true);
            }
        });
    },
    //do when user is authenticate
    postAuthenticate: function (socket, data) {
        console.log('Users permissions authenticated, allowing accesses to room')
    },
    //does after the client is disconnected
    disconnect: function (socket) {
        
    }
});

//connect to database
mongoose.connect(config.getDatabaseURI());

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//cookies setup
app.use(session);

//passport setup
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//setup handlbars view engine
app.engine('handlebars', hbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//Define routes
app.use(require('./routes/index'));
app.use(require('./routes/pages'));
app.use(require('./routes/users'));
app.use(require('./routes/download'));
app.use(require('./routes/deleteFile'));

// Serve static files
app.use('/public', express.static('public'));


app.get('/ping',(req, res)=>res.send('pong'));
app.post('/ping',(req, res)=>res.send('pong'));

//listen on port 3000
server.listen(3000, () => {
  console.log("Listening on port 3000!");
});

module.exports = app; //for testing
