const router = require('express').Router();

const Category = require('../models/category');
const Job = require('../models/job');
const Employer = require('../models/employer');
const isEmployer = require('../helpers/isEmployer');
const isUserVerified = require('../helpers/isUserVerified');

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

router.post('/jobs', isEmployer, isUserVerified, async (req, res) => {
    if (!req.app.get('employer').name || !req.app.get('employer').location) {
        return res.status(400).send({ Error: 'Please Complete Your ' });
    }
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

router.get('/:id', async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.render('404', { layout: false });
    }
    const employer = await Employer.findById(job.posted_by);
    const similarJobs = await Job
        .where('category')
        .equals(job.category)
        .where('_id')
        .ne(job._id)
        .limit(4)
        .populate('posted_by')
        .exec();
    console.log(similarJobs);
    res.render('single-job-page', {
        job,
        employer_name: employer.name || 'No Name',
        employer_link: '/employers/' + employer._id,
        employer_img: employer.logo || '/images/company-logo-05.png',
        employer_location: employer.location || 'Somewhere',
        job_type: type_array[job.type - 1],
        min: job.min_salary >= 1000 ? (job.min_salary / 1000).toString() + 'k' : job.min_salary,
        max: job.max_salary >= 1000 ? (job.max_salary / 1000).toString() + 'k' : job.max_salary,
        date: (job.created_at).toDateString(),
        similarJobs,
        layout: false,
    });
});

module.exports = router;