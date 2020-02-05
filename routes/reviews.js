'use strict'

const router = require('express').Router();

const Task = require('../models/task');
const Review = require('../models/review');

router.get('/reviews/my_reviews', async (req, res) => {
    const tasks = await Task
        .where('status')
        .equals(2)
        .where('employer_id')
        .equals(req.session._id)
        .sort({ created_at: 'desc' })
        .limit(4)
        .populate('freelancer_id')
        .exec();

    const reviews = await Review    
        .where('reviewer')
        .equals(req.session._id)
        .where('task')
        .in(tasks.map(task => task._id));
    
    let tempTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        let sw = false;
        for (let j = 0; j < reviews.length; j++) {
            if ((tasks[i]._id).toString() === (reviews[j].task).toString()) {
                sw = true;
                tempTasks.push({
                    task: tasks[i],
                    review: reviews[j],
                    review_created_at: reviews[j].created_at.toDateString(),
                });
                break;
            }
        }
        if (!sw) {
            tempTasks.push({
                task: tasks[i],
            });
        }
    }
    
    res.render('dashboard-reviews', { data: { tasks: tempTasks }, layout: false });
});

module.exports = router;