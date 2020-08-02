const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');
const Task = require('../models/task');
const Job = require('../models/job');
const Review = require('../models/review');

let user = {};
const isUser = async (req, res, next) => {
    if (req.session.role === 'freelancer') {
        const freelancer = await Freelancer.findById(req.session._id);
        const tasks = await Task.find({ freelancer_id: req.session._id });
        const review = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: '$score' } }).match({ _id: freelancer._id });
        let score;
        if (review.length === 0) {
            score = 0;
        } else {
            score = Math.round(review[0].average);
        }
        user = { ...freelancer._doc };
        user.tasks = tasks;
        user.role = req.session.role;
        user.rate = score;
        req.app.set('user', user);
        next();
    } else if (req.session.role === 'employer') {
        const employer = await Employer.findById(req.session._id);
        const tasks = await Task.find({ employer_id: req.session._id }).sort({ status: 1 });
        const jobs = await Job.find({ posted_by: req.session._id });
        const review = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: '$score' } }).match({ _id: employer._id });
        let score;
        if (review.length === 0) {
            score = 0;
        } else {
            score = Math.round(review[0].average);
        }
        user = { ...employer._doc };
        user.tasks = tasks;
        user.jobs = jobs;
        user.role = req.session.role;
        user.rate = score;
        req.app.set('user', user);
        next();
    } else {
        req.app.set('user', null);
        next();
    }
};

module.exports = isUser;