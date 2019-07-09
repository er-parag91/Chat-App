const express = require('express');
const path = require('path');


const http = require('http');

const app = express();
const socketio = require('socket.io');


const server = http.createServer(app);

const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('new websocket connection');
    socket.emit('message', 'Welcome!!');

    socket.broadcast.emit('message', 'A new has joined');

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    });

    socket.on('sendLocation', (location) => {
        io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!!');
    })
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});