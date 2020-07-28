const router = require('express').Router();

const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');
const Task = require('../models/task');
const Bid  = require('../models/bid');
const Review = require('../models/review');
const countries = require('../helpers/countries');
const isLoggedIn = require('../helpers/isLoggedIn');
const Job = require('../models/job');
let locations = require('../helpers/locations');

router.get('/dashboard', isLoggedIn, async (req, res) => {
    const user = req.app.get('user');
    // const data = req.app.get('freelancer') || req.app.get('employer');
    // data.first_name = data.first_name || 'New User';  
    if (req.session.role === 'freelancer') {
        const wonTasks = await Bid.find({ freelancer_id: req.session._id }).countDocuments();
        const appliedJobs = await Job.find({ freelancer_id: req.session._id }).countDocuments();
        const reviewCount = await Review.find({ reviewee: req.session._id }).countDocuments();
        return res.render('dashboard', {
            // data,
            user,
            wonTasks,
            appliedJobs,
            reviewCount,
            layout: false,
        });
    }
    if (req.session.role === 'employer') {
        const reviewCount = await Review.find({ reviewee: req.session._id }).countDocuments();
        return res.render('dashboard', {
            // data,
            user,
            reviewCount,
            layout: false
        });
    }
    return res.render('home', { 
        error: 'unauthorized user',
        layout: false,        
    });
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
        locations,
        role: req.session.role, 
        layout: false 
    });
});

router.post('/dashboard_settings', async (req, res) => {
    const user = req.app.get('user');
    if (req.session.role == 'freelancer') {
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.skills = req.body.skills;
        user.minimal_hourly_rate = req.body.rate;
        user.tag_line = req.body.tag_line;
        user.nationality = req.body.nationality;
        user.bio = req.body.bio;
        await user.save();
        res.send({ Message: 'Ok' });
    } else {
            user.name = req.body.name;
            user.location = req.body.location;
            user.bio = req.body.bio;
            await user.save();
            res.send({ Message: 'Ok' });
        }
});

module.exports = router;