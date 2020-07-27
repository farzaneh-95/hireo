const router = require('express').Router();

const Employer = require('../models/employer');
const Job = require('../models/job');
const Review = require('../models/review');

router.get('/', async (req, res) => {
    const companies = await Employer.find().sort({ rate: 'desc' }).limit(9);
    const user = req.app.get('user');
    res.render('browse-companies', {
        data: {
            companies,
            user,
        },
        layout: false,
    });
});

router.get('/:id', async (req, res) => {
    const user = req.app.get('user');
    const company = await Employer.findById(req.params.id);
    const jobs = await Job.find({ posted_by: company._id, status: 1 }).limit(3);
    const reviews = await Review.find({ reviewee: company._id }).sort({ created_at: 'desc' }).limit(3).populate('task').exec();
    res.render('single-company-profile', {
        data: {
            user,
            company,
            jobs,
            reviews,
        },
        layout: false,
    });
});

module.exports = router;