const express = require('express');
const path = require('path');


const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});