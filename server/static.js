const express = require('express');

const config = require('../configs');

const app = express();
const port = config.staticServer.port;

app.use(express.static('../build'))


app.listen(port, () => console.log(`Static server on port: ${port}`));