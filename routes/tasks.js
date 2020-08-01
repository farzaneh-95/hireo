const router = require('express').Router();

const Category = require('../models/category');
const Task = require('../models/task');
const Bid = require('../models/bid');
const Freelancer = require('../models/freelancer');
const isEmployer = require('../helpers/isEmployer');
const isLoggedIn = require('../helpers/isLoggedIn');
const isFreelancer = require('../helpers/isFreelancer');
const Review = require('../models/review');

router.get('/:id/bidders', async (req, res) => {
    const user = req.app.get('user');
    const task = await Task.findById(req.params.id);
    const bids = await Bid.find({ task_id: req.params.id }).populate('freelancer_id').exec();
    res.render('dashboard-manage-bidders', { 
        data: {
            user,
            task,
            bids,
        }, 
        layout: false 
    });
});

router.get('/my_bids', isFreelancer, async (req, res) => {
    const user = req.app.get('user');
    const bids = await Bid.find({ freelancer_id: req.session._id}).populate('task_id').exec();
    return res.render('dashboard-my-active-bids', {
        data: {
            bids,
            user,
        },
        layout: false,
    });
});

router.get('/my_tasks', isLoggedIn, async (req, res) => {
    const user = { ...req.app.get('user') };
    if (req.session.role === 'employer') {
        const bids = await Bid.find({ task_id: { $in: user.tasks.map(task => task._id) } });
        user.tasks.forEach(task => {
            let minimalRatesSum = 0;
            bids.map(bid => { minimalRatesSum += bid.minimal_rate });
            task.bids = bids;
            task.bid_avg = Math.floor(minimalRatesSum / bids.length) || 0;
        });
    }
    return res.render('dashboard-manage-tasks', { data: { user }, layout: false });
});

router.get('/create', isEmployer, async (req, res) => {
    const user = req.app.get('user');
    const categories = await Category.find({});
    return res.render('dashboard-post-a-task', {
        data: {
            user,
            categories,
        },
        
        layout: false,
    });
});

router.get('/:id', async (req, res) => {
    const user = req.app.get('user');
    let task = await Task.findById(req.params.id);
    if (!task) {
        return res.render('404', { layout: false });
    }
    let rate = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: "$score" } }).match({ _id: task.employer_id }).exec();
    let score = 0;
    if (rate.length > 0) {
        score = rate[0].average
    }
    task = await task.populate('employer_id').execPopulate();
    const tempTask = { ...task._doc };
    tempTask.employer_id.rate = score;
    tempTask.budget_type = task.budget_type;
    tempTask.created_at = task.created_at;
    const bids = await Bid
        .where('task_id')
        .equals(task._id)
        .populate('freelancer_id')
        .exec();
    const rates = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: "$score" } }).match({ _id: { $in: bids.map(bid => bid.freelancer_id._id) } }).exec()
    const tempBids = [];
    bids.map(bid => {
        const temp = { ...bid._doc };
        rates.map(rate => {
            if (rate._id === bid.freelancer_id._id) {
                score = rate.average;
            }
        });
        temp.freelancer_id.rate = score;
        tempBids.push(temp);
    });
    return res.render('single-task-page', {
        data: {
            task: tempTask,
            bids: tempBids,
            user,
        },
        layout: false 
    });
});

router.get('/', async (req, res) => {
    const user = req.app.get('user');
    const categories = await Category.find();
    const query = Task
        .where('status')
        .equals(1);
    if (req.query.location) {
        query
            .where('location')
            .equals(req.query.location);
    }
    if (req.query.category) {
        query
            .where('category_id')
            .equals(req.query.category);
    }
    if (req.query.title) {
        query
            .where('name')
            .equals(new RegExp(req.query.title, 'i'));
    }
    const tasks = await Task.paginate(query, { limit: 5, page: req.query.page, sort: '-created_at' });
    res.render('tasks-list-layout-1', {
        data: {
            user,
            tasks: tasks.docs,
            categories,
            currentPage: parseInt(req.query.page) || 1,
            hasNextPage: await query.countDocuments() > (parseInt(req.query.page) || 1) * 5 ? '1' : '0',
        },
        role: req.session.role,
        layout: false 
    });
});

router.post('/', async (req, res) => {
    if (!req.app.get('user').name || !req.app.get('user').location) {
        return res.status(400).send({ Error: 'Please Complete Your Profile' });
    }
    const data = {
        name: req.body.projectName,
        category_id: req.body.categoryId,
        description: req.body.description,
        location: req.body.location,
        skills: req.body.skills,
        budget_type: req.body.isFixed ? 1 : 2,
        employer_id: req.session._id,
        created_at: new Date(),
        status: 1,
    };
    if (req.body.minBudget !== 0) {
        data.min_budget = req.body.minBudget;
    }
    if (req.body.maxBudget !== 0) {
        data.max_budget = req.body.maxBudget;
    }
    const task = new Task(data);
    await task.save();
    return res.redirect('/tasks/my_tasks');
});



module.exports = router;