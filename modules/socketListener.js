module.exports = function(io) {
    io.on('connection', function(socket) {
        let roomID = socket.handshake.headers.referer.slice(-5)
        console.log('a user connected to room', roomID);
        socket.join(roomID)
        socket.on('text updating',(msg)=>{
           socket.broadcast.to(roomID).emit('updated text',msg);
        });
    });
    return true;
}
