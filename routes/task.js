const router = require('express').Router();
const Category = require('../models/category');
const Task = require('../models/task');

const categories = [];

router.get('/post_a_task', async (req, res) => {
    const categories = await Category.find({},{ title: 1, _id: 0 });
    return res.render('dashboard-post-a-task', {data: categories, layout: false });
});

router.post('/post_a_task', async (req, res) => {
    if (!(req.body.project_name && req.body.category && req.body.project_disc)) {
        return res.status(400).render('dashbboard-post-a-task', { errors: 'you need to enter all fields', layout: false });
    }
    const task_info = {
        project_name: req.body.project_name,
        category_id: req.body.category,
        location: req.body.location,
        budget: {
            min: req.body.min_budget,
            max: req.body.max_budget,
        },
        project_type: req.body.project_type,
        skills: req.body.skills,
        project_disc: req.body.project_disc,
    }
    const newTask = new Task(task_info);
    await newTask.save();
    return res.render('dashboard-post-a-task', { data: 'task posted', layout: false });
});

module.exports = router;