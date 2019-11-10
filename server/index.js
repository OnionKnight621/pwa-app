const express = require('express');
const bodyParser = require('body-parser');
const uuidV4 = require('uuid/v4');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 4567;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

let items = [
    { id: uuidV4(), item: 'Random item 1'},
    { id: uuidV4(), item: 'Random item 2'}
];

app.get('/items', (req, res) => {
    res.status(200).json(items);
});

app.post('/items', (req, res) => {
    items.push({
        id: uuidV4(),
        item: req.body.item
    });
    res.status(200).json(items);
});

app.delete('/item', (req, res) => {
    items = items.filter(item => {
        if (item.id !== req.body.id) {
            return item;
        }
    });
    res.status(200).json(items);
});

app.listen(port, () => console.log(`listening on port: ${port}`));