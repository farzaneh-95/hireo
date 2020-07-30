const router = require('express').Router();

const Employer = require('../models/employer');
const Job = require('../models/job');
const Review = require('../models/review');

router.get('/', async (req, res) => {
    const top = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: "$score" } }).sort({ average: -1 }).exec();
    const companies = await Employer.find({ _id: { $in: top.map(t => t._id) }}).limit(9).lean(true);
    companies.map(company => {
        top.map(t => {
            if (t._id.toString() === company._id.toString()) {
                company.rate = t.average.toString().split('.')[1] ? t.average.toString()[0] + '.5' : t.average;
            }
        });
    });
    companies.sort((a, b) => b.rate - a.rate);
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