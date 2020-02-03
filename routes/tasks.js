const router = require('express').Router();

const Category = require('../models/category');
const Task = require('../models/task');
const Freelancer = require('../models/freelancer');

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

router.get('/manage_tasks', async (req, res) => {
    // const tasks = await Task.find({ employer_id: req.cookies._id }, { name: 1, 
    //     min_budget: 1, 
    //     max_budget: 1, 
    //     budget_type: 1,
    //     bids: 1, 
    //     _id: 0 });
        // tasks.forEach( async task => {
        //     const bidsAvg = await task.populate('bids').exec();
        //     console.log(bidsAvg);
        // });
        // console.log(tasks);
    
    // return res.render('dashboard-manage-tasks', { data: tasks, layout: false });
    Task.findOne({ _id: "5e35d90b70f9da4f104a05c6" }).populate('bids').exec((err, task) => {
        console.log(task);
    });

    router.get('/browse_task', async (req, res) => {
        return res.render('task-list-layout-1', { layout: false });
    })
});

module.exports = router;