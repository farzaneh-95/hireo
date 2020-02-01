const express = require('express');
const fs = require ('fs');
var validator = require('validator');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');

const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const taskRouter = require('./routes/task');

const app = express();

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/hireo', { useNewUrlParser: true });

app.use(expressSession({ secret: '12345', cookie: { maxAge: 9000000000000 } }));

app.use(cookieParser());

app.engine('handlebars', handlebars({ helpers: require('./helpers/handlebars') }));

app.set('view engine', 'handlebars');

app.use('/', authRouter);

app.use('/', dashboardRouter);

app.use('/', taskRouter);

app.get('/', (req, res) => {
    return res.render('home', { layout: false });
});

app.use((req, res) => {
    res.status(404).render('404', { layout: false });
})

app.listen(3000);