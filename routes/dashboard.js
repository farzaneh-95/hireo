const router = require('express').Router();

const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');
const Task = require('../models/task');
const Review = require('../models/review');
const countries = require('../helpers/countries');
const isLoggedIn = require('../helpers/isLoggedIn');
const Job = require('../models/job');

router.get('/dashboard', isLoggedIn, async (req, res) => {
    const user = req.app.get('user');
    const data = req.app.get('freelancer') || req.app.get('employer');
    data.first_name = data.first_name || 'New User';  
    if (req.session.role === 'freelancer') {
        const wonTasks = await Task.find({ freelancer_id: req.session._id }).countDocuments();
        const appliedJobs = await Job.find({ 'applies.freelancer_id': req.session._id }).countDocuments();
        const reviewCount = await Review.find({ reviewer: req.session._Id }).countDocuments();
        return res.render('dashboard', {
            data,
            user,
            wonTasks,
            appliedJobs,
            reviewCount,
            layout: false,
        });
    }
});

router.get('/dashboard_settings', async (req, res) => {
    const user = req.app.get('user');
    let data;
    if (req.session.role === 'freelancer') {
        data = await Freelancer.findById(req.session._id);
    } else if (req.session.role === 'employer') {
        data = await Employer.findById(req.session._id);
    }
    res.render('dashboard-settings', { 
        data,
        user,
        countries: countries, 
        role: req.session.role, 
        layout: false 
    });
});

router.post('/dashboard_settings', async (req, res) => {
    if (req.session.role == 1) {
        const freelancer = await Freelancer.findOne({ _id: req.session._id });
        if (freelancer) {
            new_info = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                skills: req.body.skills,
                minimal_hourly_rate: req.body.rate,
                tag_line: req.body.tag_line,
                nationality: req.body.nationality,
                bio: req.body.bio,
            }
            await freelancer.updateOne(new_info);
            return res.render('dashboard', { layout: false });
        }
    } else {
        const employer = await Employer.findOne({ _id: req.session._id });
        if (employer) {
            new_info = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
            }
            await employer.updateOne(new_info);
            return res.render('dashboard', { layout: false });
        }
    }
});

router.get('/reviews', async (req, res) => {
    const user = req.app.get('user');
    if (req.session.role === 'employer') {
        let tasks = await Task
            .where('status')
            .ne(1)
            .where('employer_id')
            .equals(req.session._id)
            .skip((parseInt(req.query.page) - 1) * 4 || 0)
            .limit(4);
        
        return res.render('dashboard-reviews', { 
            data: {
                tasks,
                user,
            },
            role: req.session.role,
            layout: false,
        });
    }
});

module.exports = router;