const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

let messages = [];
let users = [];
app.use(express.static(path.join(__dirname + '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
const io = socket(server);
io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('join', (user) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        users.push(user);
        console.log(users);
        socket.broadcast.emit('newUser', user);

    })

    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');
        let userOut = users.find(user => user.id === socket.id);
        socket.broadcast.emit('removeUser', userOut);
        let i = users.indexOf(userOut);
        users.splice(i, 1);
        console.log(users);

    });
});
