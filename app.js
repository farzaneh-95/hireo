const express = require('express');
const fs = require ('fs');
var validator = require('validator');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');

const app = express();

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/resume', { useNewUrlParser: true });

app.use(cookieParser());

app.engine('handlebars', handlebars());

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    return res.render('home', { layout: false });
});

app.listen(3000);