const router = require('express').Router();
const multer  = require('multer');

const Category = require('../models/category');
const Job = require('../models/job');
const Employer = require('../models/employer');
const Freelancer = require('../models/freelancer');
const isEmployer = require('../helpers/isEmployer');
const isUserVerified = require('../helpers/isUserVerified');

router.get('/jobs/candidates', (req, res) => { 
    const user = req.app.get('user');
    return res.render('dashboard-manage-candidates', {
        data: {
            user,
        },
        layout: false,
    });
});

router.get('/jobs/my_jobs', async (req, res) => {
    const user = req.app.get('user');
    if (req.session.role === 'employer') {
        const myJobs = await Job
            .where('posted_by')
            .equals(req.session._id)
            .sort({ created_at: 'desc' });
        
        const tempJobs = [];
        myJobs.forEach(job => {
            tempJobs.push({ job: job, applyCount: job.applies.length })
        });
        res.render('dashboard-manage-jobs', { data: { jobs: tempJobs, user }, layout: false, });
    }
});

router.get('/jobs/create', isEmployer, async (req, res) => {
    const user = req.app.get('user');
    const categories = await Category.find({});
    return res.render('dashboard-post-a-job', {
        data: {
            user
        },
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
        type: req.body.type,
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

router.get('/jobs', async (req, res) => {
    const user = req.app.get('user');
    const query = Job
        .where('status')
        .equals(1);
    if (req.query.location) {
        query
            .where('location')
            .equals(req.query.location);
    }
    if (req.query.category) {
        query
            .where('category')
            .equals(req.query.category);
    }
    if (req.query.title) {
        query
            .where('title')
            .equals(new RegExp(req.query.title), 'i');
    }
    const jobs = await Job.paginate(query, { limit: 8, page: parseInt(req.query.page), populate: 'posted_by' });
    const categories = await Category.find();
    res.render('jobs-list-layout-1', {
        data: {
            jobs: jobs.docs,
            categories,
            user,
        },
        layout: false
    });
});

router.get('/jobs/:id', async (req, res) => {
    const user = req.app.get('user');
    const job = await Job.findOne({ status: 1, _id: req.params.id });
    if (!job) {
        return res.render('404', { layout: false });
    }
    const employer = await Employer.findById(job.posted_by);
    let hasApplied = 0;
    let freelancer;
    if (req.session.role === 'freelancer') {
        freelancer = await Freelancer.findById(req.session._id);
        job.applies.forEach(apply => {
            if (apply.freelancer_id === freelancer._id) {
                hasApplied = 1;
                return;
            }
        });
    }
    const similarJobs = await Job
        .where('category')
        .equals(job.category)
        .where('status')
        .equals(1)
        .where('_id')
        .ne(job._id)
        .limit(4)
        .populate('posted_by')
        .exec();
    res.render('single-job-page', {
        data: user,
        job,
        employer_name: employer.name || 'No Name',
        employer_link: '/employers/' + employer._id,
        employer_img: employer.logo || '/images/company-logo-05.png',
        employer_location: employer.location || 'Somewhere',
        similarJobs,
        role: req.session.role || 'unknown',
        hasApplied,
        freelancer,
        layout: false,
    });
});

module.exports = router;