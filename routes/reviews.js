'use strict'

const router = require('express').Router();

const Task = require('../models/task');
const Review = require('../models/review');

router.get('/my_reviews', async (req, res) => {
    const user = req.app.get('user');
    if (req.session.role === 'employer') {
        const reviews = await Review.where('reviewer').equals(req.session._id).populate('task').exec();
        const tasks = await Task.where('status').equals(3).where('employer_id').equals(req.session._id).where('_id').nin(reviews.map(review => review.task))
            .sort({ created_at: 'desc' }).populate('freelancer_id').exec();
        res.render('dashboard-reviews', { data: { user: req.app.get('user'), tasks, reviews, currPage: req.query.page || 1 }, layout: false }); 
    } else if (req.session.role === 'freelancer') {
        const tasks = await Task
            .where('status')
            .equals(3)
            .where('freelancer_id')
            .equals(req.session._id)
            .sort({ created_at: 'desc' })
            .skip(req.query.page ? (parseInt(req.query.page) - 1) * 4 : 0)
            .limit(4)
            .lean(true)
            .populate('employer_id')
            .exec();

        const reviews = await Review    
            .where('reviewer')
            .equals(req.session._id)
            .where('task')
            .in(tasks.map(task => task._id));
        
        tasks.forEach(task => {
            task.created_at = task.created_at.toDateString();
            task.user = req.session.role;
            reviews.forEach(rev => {
                if (task._id.toString() === rev.task.toString()) {
                    task.review = rev;
                }
            });
        });
        res.render('dashboard-reviews', { data: { user, tasks: tasks, currPage: req.query.page || 1 }, layout: false });  
    } else {
        return res.redirect('/');
    }
});

router.post('/', async (req, res) => {
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