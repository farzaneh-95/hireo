const router = require('express').Router();
const faker = require('faker');

const Freelancer = require('../models/freelancer');
const Task = require('../models/task');
const Review = require('../models/review');
const Job = require('../models/job');

router.get('/', async (req, res) => {
    const user = req.app.get('user');
    const query = Freelancer.find();
    if (req.query.location) {
        query
            .where('nationality')
            .equals(req.query.location);
    }
    if (req.query.title) {
        query
            .where('tag_line')
            .equals(new RegExp(req.query.title), 'i');
    }
    const freelancers = await Freelancer.paginate(query, { limit: 5, page: parseInt(req.query.page) });
    freelancers.docs.map(async freelancer => {
        const scores = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: '$score' } }).match({ _id: freelancer._id }).exec();
        let score;
        if (scores.length === 0) {
            score = 0;
        } else {
            score = Math.round(scores[0].average);
        }
        freelancer.rate = score;
    });
    return res.render('freelancers-list-layout-1', {
        data: {
            user,
            freelancers: freelancers.docs,
            currentPage: parseInt(req.query.page) || 1,
            hasNextPage: await query.countDocuments() > (parseInt(req.query.page) || 1) * 5 ? '1' : '0',
        },
        layout: false,
    });
});

router.get('/:id', async (req, res) => {
    const user = req.app.get('user');
    const freelancer = await Freelancer.findById(req.params.id);
    freelancer.view_count++;
    await freelancer.save();
    const tasksDone = await Task.find({ freelancer_id: freelancer._id, status: 3 }).countDocuments();
    const tasks = await Task.find({ freelancer_id: freelancer._id }).sort({ created_at: 'desc' }).limit(5);
    const reviews = await Review.find({ reviewee: freelancer._id }).sort({ created_at: 'desc' }).limit(5).populate('task').exec();
    const scores = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: '$score' } }).match({ _id: freelancer._id }).exec();
    const jobs = await Job.find({ 'applies.freelancer_id': freelancer._id,  'applies.accepted': true }).sort({ created_at: 'desc' })
        .limit(3).populate('posted_by').exec();
    let score;
    if (scores.length === 0) {
        score = 0;
    } else {
        score = Math.round(scores[0].average);
    }
    freelancer.rate = score;
    return res.render('single-freelancer-profile', {
        data: {
            user,
            freelancer,
            tasksDone,
            tasks,
            reviews,
            jobs,
        },
        layout: false,
    });
});

module.exports = router;