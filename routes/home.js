const Category = require('../models/category');
const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');
const Task = require('../models/task');
const Job = require('../models/job');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const categories = await Category.find({}).limit(8);
    const freelancersCount = await Freelancer.find({}).count();
    const tasksCount = await Task.find({}).count();
    const jobsCount = await Job.find({}).count();
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
            quantity: {
                freelancersCount,
                tasksCount,
                jobsCount,
            },
            user,
        },
         layout: false
    });
});

module.exports = router;