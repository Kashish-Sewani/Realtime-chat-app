// Node server which will handle socket io connections
const io = require('socket.io')(8004);

const users = {};

io.on('connection', socket => {
    // When a new user joins, let other users connected to the server know !
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // When a user sends a message
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // When a user leaves the chat, let others know
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            const userName = users[socket.id];
            socket.broadcast.emit('left', userName);
            delete users[socket.id];
        }
    });
});



