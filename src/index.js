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
let count = 0;
io.on('connection', (socket) => {
    console.log('new websocket connection');

    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;
        // io.emit notifies all the connection unlike socket.emit
        io.emit('countUpdated', count);
    })
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});