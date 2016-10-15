"use strict";

const express = require('express');
const ejs = require('ejs');
const PORT = 3002;

const app = express();

app.set('view engine', 'ejs')

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(PORT, function(req, res){
    console.log(`listening on port ${PORT}`);
});
