'use strict'

const router = require('express').Router();

const Task = require('../models/task');
const Review = require('../models/review');

router.get('/my_reviews', async (req, res) => {
    const user = req.app.get('user');
    const reviews = await Review.where('reviewer').equals(req.session._id).populate('task').exec();
    if (req.session.role === 'employer') { 
        const tasks = await Task.where('status').equals(3).where('employer_id').equals(req.session._id).where('_id').nin(reviews.map(review => review.task))
            .sort({ created_at: 'desc' }).populate('freelancer_id').exec();
        res.render('dashboard-reviews', { data: { user: req.app.get('user'), tasks, reviews: await Review.where('reviewer').equals(req.session._id).populate('task').exec() }, layout: false }); 
    } else if (req.session.role === 'freelancer') {
        const tasks = await Task.where('status').equals(3).where('freelancer_id').equals(req.session._id).where('_id').nin(reviews.map(review => review.task))
            .sort({ created_at: 'desc' }).populate('employer_id').exec();
        res.render('dashboard-reviews', { data: { user: req.app.get('user'), tasks, reviews: await Review.where('reviewer').equals(req.session._id).populate('task').exec() }, layout: false });
    } else {
        return res.redirect('/');
    }
});

router.post('/', async (req, res) => {
    await new Review ({
        reviewer: req.session._id,
        reviewee: req.body.reviewee_id,
        task: req.body.task_id,
        score: req.body.rating,
        comment: req.body.comment,
        created_at: new Date(), 
    }).save();
    res.redirect('/reviews/my_reviews');
});

module.exports = router;