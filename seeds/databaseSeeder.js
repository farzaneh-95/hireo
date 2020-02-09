const mongoose = require('mongoose');

const categorySeeder = require('./categorySeeder');
const employerSeeder = require('./employerSeeder');
const freelancerSeeder = require('./freelancerSeeder');
const taskSeeder = require('./taskSeeder');
const bidSeeder = require('./bidSeeder');
const reviewSeeder = require('./reviewSeeder');
const jobSeeder = require('./jobSeeder');

const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/' + 'hireo_db');
mongoose.connect('mongodb://127.0.0.1:27017/' + 'hireo_db', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const seed = async () => {
    await conn.dropDatabase();
    const categories = await categorySeeder();
    const employers = await employerSeeder();
    const freelancers = await freelancerSeeder();
    const tasks = await taskSeeder(categories, employers, freelancers);
    const bids = await bidSeeder(freelancers, tasks);
    const reviews = await reviewSeeder(freelancers, employers, tasks);
    const jobs = await jobSeeder(categories, employers, freelancers);
    console.log('Seeds Done');
    process.exit(0);
};

seed();
