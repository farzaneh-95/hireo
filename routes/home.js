const Category = require('../models/category');
const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');
const Task = require('../models/task');
const Job = require('../models/job');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const user = req.app.get('user');
    const categories = await Category.find({}).limit(8);
    const data = [];
    categories.map(async cat => {
        data.push({
            category: cat,
            count: await Job
                .where('category')
                .equals(cat._id)
                .countDocuments(),
        });
    });
    const freelancersCount = await Freelancer.find({}).countDocuments();
    const tasksCount = await Task.find({}).countDocuments();
    const jobsCount = await Job.find({}).countDocuments();
    const jobs = await Job
        .where('status')
        .equals(1)
        .sort({ created_at: -1 })
        .limit(5)
        .populate('posted_by')
        .exec();    
    const cities = await Job
        .aggregate()
        .group({ _id: '$location', count: { $sum: 1 } })
        .sort({ 'count': -1 })
        .limit(4)
        .exec();
    
    const freelancers = await Freelancer
        .find({})
        .sort({ rate: -1 })
        .limit(6);

    res.render('home', {
        data: {
            categories: data,
            quantity: {
                freelancersCount,
                tasksCount,
                jobsCount,
            },
            freelancers,
            user,
            jobs,
            cities,
        },
        layout: false
    });
});

module.exports = router;