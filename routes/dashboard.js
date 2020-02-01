const router = require('express').Router();
const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');
const countries = require('../helpers/countries');

router.get('/dashboard', (req, res) => {
    console.log(req.session._id);
    const data = req.app.get('freelancer') || req.app.get('employer');
    data.first_name = data.first_name || 'New User';  
    return res.render('dashboard', {
        layout: false,
        data,
    });
});

router.get('/dashboard-settings', async (req, res) => {
    if (req.session.role == 1) {
        const freelancer = await Freelancer.findById(req.session._id);
        return res.render('dashboard-settings', { data: freelancer, countries: countries, role: req.session.role, layout: false });
    }
});

router.post('/dashboard-settings', async (req, res) => {
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

module.exports = router;