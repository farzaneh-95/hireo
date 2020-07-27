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
const freelancerRouter = require('./routes/freelancers');
const companyRouter = require('./routes/companies');

const isUser = require('./helpers/isUser');

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

app.use('/', isUser, homeRouter)
app.use('/', isUser, authRouter);
app.use('/tasks', isUser, taskRouter);
app.use('/', isUser, dashboardRouter);
app.use('/jobs', isUser, jobRouter);
app.use('/', isUser, bidRouter);
app.use('/reviews', isUser, reviewRouter);
app.use('/freelancers', isUser, freelancerRouter);
app.use('/companies', isUser, companyRouter);

app.use(isUser, (req, res) => {
    const user = req.app.get('user');
    res.status(404).render('404', {data: { user }, layout: false });
});

app.listen(3000);