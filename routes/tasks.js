const router = require('express').Router();

const Category = require('../models/category');
const Task = require('../models/task');

router.get('/tasks', async (req, res) => {
    const categories = await Category.find({});
    res.render('dashboard-post-a-task', { data: categories, layout: false });
});

router.post('/tasks', async (req, res) => {
    const data = {
        name: req.body.projectName,
        category_id: req.body.categoryId,
        description: req.body.description,
        location: req.body.location,
        skills: req.body.skills,
        budget_type: req.body.isFixed ? 1 : 2,
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

router.get('/manage_tasks', (req, res) => {
    res.render('dashboard-manage-tasks', { layout: false });
});

module.exports = router;