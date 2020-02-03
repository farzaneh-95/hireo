const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const taskRouter = require('./routes/tasks');

const Category = require('./models/category');
const Freelancer = require('./models/freelancer');
const Employer = require('./models/employer');

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

app.use('/', authRouter);
// app.use('/', isLoggedIn, taskRouter);
// app.use('/', isLoggedIn, dashboardRouter);
app.use('/', taskRouter);
app.use('/', dashboardRouter);

app.get('/', async (req, res) => {
    const categories = await Category.find({}).limit(8);
    const freelancersCount = await Freelancer.find({}).count();
    let user;
    if (req.session.role === 'freelancer') {
        user = await Freelancer.findById(req.session._id); 
    } else if (req.session.role === 'employer') {
        user = await Employer.findById(req.session._id);
    } else {
        user = null;
    }
    res.render('home', {
        data: {
            categories,
            freelancersCount,
            user,
        },
         layout: false
    });
});

app.use((req, res) => {
    res.status(404).render('404', { layout: false });
});

app.listen(3000);