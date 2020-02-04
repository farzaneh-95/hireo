const router = require('express').Router();

const Category = require('../models/category');
const Job = require('../models/job');
const isEmployer = require('../helpers/isEmployer');

const type_array = [
    'Full Time',
    'Freelance',
    'Part Time',
    'Internship',
    'Temporary',
];

router.get('/post_job', isEmployer, async (req, res) => {
    const categories = await Category.find({});
    return res.render('dashboard-post-a-job', {
        categories,
        layout: false,
    });
});

router.post('/jobs', isEmployer, async (req, res) => {
    const job = await new Job({
        title: req.body.title,
        type: type_array.indexOf(req.body.type) + 1,
        category: req.body.category,
        location: req.body.location,
        min_salary: req.body.min,
        max_salary: req.body.max,
        tags: req.body.tags,
        description: req.body.description,
        posted_by: req.session._id,
        created_at: new Date(),
    });
    await job.save();
    res
        .status(201)
        .send({ Message: 'Ok' });
});

module.exports = router;