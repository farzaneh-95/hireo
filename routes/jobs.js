const router = require('express').Router();
const multer  = require('multer');

const Category = require('../models/category');
const Job = require('../models/job');
const Review = require('../models/review');
const Employer = require('../models/employer');
const Freelancer = require('../models/freelancer');
const isEmployer = require('../helpers/isEmployer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
  });
   
const upload = multer({ storage: storage })

router.get('/:id/apply', async (req, res) => {
    const job = await Job.findOne({ status: 1, _id: req.params.id });
    if (!job) {
        return res.render('404', { layout: false });
    }
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
    return res.render('apply-for-a-job', {job_id: job._id, freelancer, hasApplied, layout: false });
});

router.post('/:id/apply', upload.single('cv'), async (req, res) => {
    const job = await Job.findById(req.params.id);
    const candidate = {
        freelancer_id: req.session._id,
        phone: req.body.phone,
        cv_path: req.filename,
        created_at: new Date(), 
    };
    job.freelancer_id.push(req.session._id);
    job.applies.push(candidate);
    await job.save();
    return res.redirect('/jobs/' + req.params.id);
});

router.get('/:id/candidates', isEmployer, async (req, res) => { 
    const user = req.app.get('user');
    const candidates = (await Job.find({_id: req.params.id}).populate('applies.freelancer_id').exec())[0].applies;
    const jobs = await Job.findById(req.params.id);
    if (jobs.posted_by.toString() !== req.session._id) {
        return res.status(401).send({ Error: 'Unauthorized Access' });
    }
    return res.render('dashboard-manage-candidates', {
        data: {
            user,
            candidates,
        },
        layout: false,
    });
});

router.get('/my_jobs', isEmployer, async (req, res) => {
    const user = req.app.get('user');
    if (req.session.role === 'employer') {
        const myJobs = await Job
            .where('posted_by')
            .equals(req.session._id)
            .sort({ status: 'asc', created_at: 'desc' });
        
        const tempJobs = [];
        myJobs.forEach(async job => {
            tempJobs.push({ job: job, applyCount: job.applies.length })
            if (Date.parse(job.created_at) + 12096e5 < Date.now()) {
                job.status = 2;
                await job.save();
            }
        });
        res.render('dashboard-manage-jobs', { data: { jobs: tempJobs, user }, layout: false, });
    }
});

router.get('/create', isEmployer, async (req, res) => {
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

router.post('/', async (req, res) => {
    if (!req.app.get('user').name || !req.app.get('user').location) {
        return res.status(400).send({ Error: 'Please Complete Your Profile' });
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
    return res.status(201).send({ Message: 'Ok' });
});

router.get('/', async (req, res) => {
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
    const jobs = await Job.paginate(query, { limit: 8, page: parseInt(req.query.page), sort: '-created_at', populate: 'posted_by' });
    const categories = await Category.find();
    res.render('jobs-list-layout-1', {
        data: {
            jobs: jobs.docs,
            categories,
            user,
            currentPage: parseInt(req.query.page) || 1,
            hasNextPage: await query.countDocuments() > (parseInt(req.query.page) || 1) * 8 ? '1' : '0',
        },
        layout: false
    });
});

router.get('/:id', async (req, res) => {
    const user = req.app.get('user');
    const job = await Job.findOne({ status: 1, _id: req.params.id });
    if (!job) {
        return res.render('404', { layout: false });
    }
    const employer = await Employer.findById(job.posted_by);
    const review = await Review.aggregate().group({ _id: '$reviewee', average: { $avg: '$score' } }).match({ _id: employer._id });
    let score;
    if (review.length === 0) {
        score = 0;
    } else {
        score = Math.round(review[0].average);
    }
    let hasApplied = 0;
    let freelancer;
    if (req.session.role === 'freelancer') {
        freelancer = await Freelancer.findById(req.session._id);
        job.applies.forEach(apply => {
            if (apply.freelancer_id.toString() === freelancer._id.toString()) {
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
        user,
        job,
        employer_name: employer.name || 'No Name',
        employer_link: '/companies/' + employer._id,
        employer_img: employer.logo || '/images/company-logo-05.png',
        employer_location: employer.location || 'Somewhere',
        employer_rate: score,
        similarJobs,
        role: req.session.role || 'unknown',
        hasApplied,
        freelancer,
        layout: false,
    });
});

router.delete('/:id', async (req, res) => {
    await Job.deleteOne({ _id: req.params.id });
    res.json({ message: 'deleted' });
});

module.exports = router;