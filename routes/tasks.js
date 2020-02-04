const router = require('express').Router();

const Category = require('../models/category');
const Task = require('../models/task');
const Freelancer = require('../models/freelancer');
const isLoggedIn = require('../helpers/isLoggedIn');


router.get('/tasks/:id', async (req, res) => {
    let task = await Task.findById(req.params.id);
    if (!task) {
        return res.render('404', { layout: false });
    }
    task = await task.populate('employer_id').execPopulate();
    return res.render('single-task-page', {
        data: task,
        link: '/employers/' + task.employer_id, 
        created_at: task.created_at.toDateString(),
        layout: false 
    });
});

router.get('/tasks', async (req, res) => {
    const categories = await Category.find({});
    res.render('dashboard-post-a-task', {
        data: categories,
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

router.get('/manage_tasks', async (req, res) => {
    const tasks = await Task.find({ employer_id: req.session._id }, {
        name: 1, 
        min_budget: 1, 
        max_budget: 1, 
        budget_type: 1,
        bids: 1,
        created_at: 1, 
        status: 1,
        _id: 0 
    });
    tasks.forEach(task => {
        task.created_at_alt = (new Date(task.created_at)).toDateString();
    });
    return res.render('dashboard-manage-tasks', {
        data: { tasks }, layout: false 
    });
});

module.exports = router;