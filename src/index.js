const express = require('express');
const path = require('path');
const http = require('http');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');


const app = express();
const socketio = require('socket.io');


const server = http.createServer(app);

const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('new websocket connection');
    socket.emit('message', generateMessage('Welcome!'));

    socket.broadcast.emit('message', generateMessage('A new has joined'));

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }
        io.emit('message', generateMessage(message));
        callback();
    });

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!!'));
    })
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});