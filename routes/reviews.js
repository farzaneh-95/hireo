'use strict'

const router = require('express').Router();

const Task = require('../models/task');
const Review = require('../models/review');

router.get('/reviews/my_reviews', async (req, res) => {
    if (req.session.role === 'employer') {
        const tasks = await Task
        .where('status')
        .equals(3)
        .where('employer_id')
        .equals(req.session._id)
        .sort({ created_at: 'desc' })
        .skip(req.query.page ? (parseInt(req.query.page) - 1) * 4 : 0)
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
                        role: req.session.role,
                    });
                    break;
                }
            }
            if (!sw) {
                tempTasks.push({
                    task: tasks[i],
                    role: req.session.role,
                });
            }
        }   
        res.render('dashboard-reviews', { data: { tasks: tempTasks, currPage: req.query.page || 1 }, layout: false }); 
    } else if (req.session.role === 'freelancer') {
        const tasks = await Task
        .where('status')
        .equals(3)
        .where('freelancer_id')
        .equals(req.session._id)
        .sort({ created_at: 'desc' })
        .skip(req.query.page ? (parseInt(req.query.page) - 1) * 4 : 0)
        .limit(4)
        .populate('employer_id')
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
                        role: req.session.role,
                    });
                    break;
                }
            }
            if (!sw) {
                tempTasks.push({
                    task: tasks[i],
                    role: req.session.role,
                });
            }
            console.log(tempTasks);
            res.render('dashboard-reviews', { data: { tasks: tempTasks, currPage: req.query.page || 1 }, layout: false });
        }  
    } else {
        return res.redirect('/');
    }
});

router.post('/reviews', async (req, res) => {
    const rev = new Review ({
        reviewer: req.session._id,
        reviewee: req.body.reviewee_id,
        task: req.body.task_id,
        score: req.body.rating,
        comment: req.body.comment,
        created_at: new Date(), 
    });
    await rev.save();
    res.redirect('/reviews/my_reviews');
});

module.exports = router;