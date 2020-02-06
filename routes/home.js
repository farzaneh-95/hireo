const Category = require('../models/category');
const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');
const Task = require('../models/task');
const Job = require('../models/job');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const categories = await Category.find({}).limit(8);
    const data = [];
    categories.map(async cat => {
        data.push({
            category: cat,
            count: await Job
                .where('category')
                .equals(cat._id)
                .where('status')
                .equals(1)
                .countDocuments(),
        });
    });
    const freelancersCount = await Freelancer.find({}).countDocuments();
    const tasksCount = await Task.find({ status: 1 }).countDocuments();
    const jobsCount = await Job.find({ status: 1 }).countDocuments();
    let user;
    if (req.session.role === 'freelancer') {
        user = await Freelancer.findById(req.session._id); 
    } else if (req.session.role === 'employer') {
        user = await Employer.findById(req.session._id);
    } else {
        user = null;
    }
    const jobs = await Job
        .find({})
        .sort({ created_at: -1 })
        .limit(5)
        .populate('posted_by')
        .exec();
    const tempJobs = [];
    jobs.map(job => {
        tempJobs.push({
            job,
            created_at: job.created_at.toDateString(),
        });
    });
    const cities = await Job
        .aggregate()
        .group({ _id: '$location', count: { $sum: 1 } })
        .sort({ 'count': -1 })
        .limit(4)
        .exec();
    res.render('home', {
        data: {
            categories: data,
            quantity: {
                freelancersCount,
                tasksCount,
                jobsCount,
            },
            user,
            jobs: tempJobs,
            cities,
        },
        layout: false
    });
});

module.exports = router;