require('dotenv').config();
const express = require('express'),
    app = express(),
    fileUpload = require('express-fileupload'),
    bodyParser = require('body-parser'),
    path = require('path'),
    logger = require(path.join(__dirname, 'lib', 'helpers', 'logger'));


const generateBlockData = require(path.join(__dirname, 'lib', 'controllers', 'block', 'generate')),
    solveBlockTask = require(path.join(__dirname, 'lib', 'controllers', 'block', 'solve')),
    generateTxData = require(path.join(__dirname, 'lib', 'controllers', 'tx', 'generate')),
    solveTxTask = require(path.join(__dirname, 'lib', 'controllers', 'tx', 'solve')),
    uploadBlock = require(path.join(__dirname, 'lib', 'controllers', 'block', 'upload')),
    uploadTx = require(path.join(__dirname, 'lib', 'controllers', 'tx', 'upload'));


app
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(express.static(path.join(__dirname, 'public')))
    .use(fileUpload());

app.post('/block/generate', generateBlockData);
app.post('/block', solveBlockTask);

app.post('/tx/generate', generateTxData);
app.post('/tx', solveTxTask);

app.post('/uploadBlock', uploadBlock);
app.post('/uploadTx', uploadTx);

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
    logger.debug('Coursework', server.address(), {serverName: process.env.SERVER_NAME});
});
