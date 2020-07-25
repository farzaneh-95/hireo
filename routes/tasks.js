const router = require('express').Router();

const Category = require('../models/category');
const Task = require('../models/task');
const Bid = require('../models/bid');
const Freelancer = require('../models/freelancer');
const isEmployer = require('../helpers/isEmployer');

router.get('/tasks/:id/bidders', async (req, res) => {
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

router.get('/tasks/my_bids', async (req, res) => {
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

router.get('/tasks/my_tasks', async (req, res) => {
    const user = req.app.get('user');
    let bids;
    if (req.session.role === 'freelancer') {
        bids = await Bid.find({ freelancer_id: req.session._id }).lean(true);
        user.tasks.forEach(task => {
            task.created_at = task.created_at.toDateString();
            task.budget_type = task.budget_type === 0  ? 'Fixed' : 'Hourly'; 
            let count = 0;
            const temp = [];
            bids.forEach(bid => {
                if (bid.task_id.toString() === task._id.toString()) {
                    temp.push(bid);
                    count += bid.minimal_rate;
                }
            });
            task.bids = temp;
            task.bid_avg = Math.floor(count / temp.length);
        });
    } else if (req.session.role === 'employer') {
        bids = await Bid.find({ task_id: { $in: user.tasks.map(task => task._id) } }).lean(true);
        user.tasks.forEach(task => {
            task.created_at = task.created_at.toDateString();
            task.budget_type = task.budget_type === 0  ? 'Fixed' : 'Hourly'; 
            let count = 0;
            const temp = [];
            bids.forEach(bid => {
                if (bid.task_id.toString() === task._id.toString()) {
                    temp.push(bid);
                    count += bid.minimal_rate;
                }
            });
            task.bids = temp;
            task.bid_avg = Math.floor(count / temp.length);
        });
    }
    return res.render('dashboard-manage-tasks', {
        data: { 
            user,
        }, 
        layout: false,
    });
});

router.get('/tasks/create', isEmployer, async (req, res) => {
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

router.get('/tasks/:id', async (req, res) => {
    const user = req.app.get('user');
    let task = await Task.findById(req.params.id);
    if (!task) {
        return res.render('404', { layout: false });
    }
    task = await task
        .populate('employer_id')
        .execPopulate();
    const bids = await Bid
        .where('task_id')
        .equals(task._id)
        .populate('freelancer_id')
        .exec();
    return res.render('single-task-page', {
        data: {
            task,
            bids,
            user,
        },
        layout: false 
    });
});

router.get('/tasks', async (req, res) => {
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
    const tasks = await Task.paginate(query, { limit: 5, page: req.query.page });
    res.render('tasks-list-layout-1', {
        data: {
            user,
            tasks: tasks.docs,
            categories,
        },
        role: req.session.role,
        layout: false 
    });
});

router.post('/tasks', async (req, res) => {
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
    return res.send({ message: 'ok' });
});



module.exports = router;