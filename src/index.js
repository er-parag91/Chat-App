const express = require('express');
const path = require('path');


const http = require('http');

const app = express();
const server = http.createServer(app);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});