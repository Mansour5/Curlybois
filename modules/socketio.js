//socket authentication middleware
//How it works: user connects to socket with zero permissions, then socket runs authenticate, if authenticated give permissions.

const socketio = require('socket.io')
const socketioauth = require('socketio-auth')
const sharedsession = require("express-socket.io-session")

const Page = require('../models/page')

module.exports = function(server, session){
    const io = socketio(server)

    //shares the session with socket
    io.use(sharedsession(session, {
        autoSave:true
    }))

    io.on('connection', function(socket) {
        let roomID = socket.handshake.headers.referer.slice(-5)
        console.log('a user connected to room', roomID)
        socket.join(roomID)
        socket.on('text updating',(msg)=>{
           socket.broadcast.to(roomID).emit('updated text',msg)
        })
    })

    socketioauth(io, {
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
            //
        }
    })
}