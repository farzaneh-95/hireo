const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const taskRouter = require('./routes/tasks');
const bidRouter = require('./routes/bids');
const jobRouter = require('./routes/jobs');
const reviewRouter = require('./routes/reviews');

const isLoggedIn = require('./helpers/isLoggedIn');

const app = express();

mongoose.connect('mongodb://localhost:27017/hireo_db', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 10*60*60*24*7*4 },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars({ helpers: require('./helpers/handlebars') }));
app.set('view engine', 'handlebars');

app.use('/', homeRouter)
app.use('/', authRouter);
app.use('/', taskRouter);
app.use('/', dashboardRouter);
app.use('/', jobRouter);
app.use('/', bidRouter);
app.use('/', reviewRouter);
// app.use('/', taskRouter);
// app.use('/', dashboardRouter);

app.use((req, res) => {
    res.status(404).render('404', { layout: false });
});

app.listen(3000);