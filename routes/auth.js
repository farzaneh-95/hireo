const router = require('express').Router();
const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

router.post('/register', async (req, res) => {
    if (await Freelancer.findOne({ email: req.body.email }) || await Employer.findOne({ email: req.body.email })) {
        return res.status(400).render('home', { errors: 'email exists', layout: false });
    }
    if (req.body.password !== req.body.password_repeat) {
        return res.status(400).render('home', { errors: 'password does not match', layout: false });
    }
    if (req.body.freelancer_type) {
        const newFreelancer = new Freelancer({ email: req.body.email, password: req.body.password });
        const temp = await newFreelancer.save();
        req.session.role = 1;
        req.session._id = temp._id;
        return res.render('dashboard', { layout: false });
    }
    else if (req.body.employer_type) {
        const newEmployer = new Employer({ email: req.body.email, password: req.body.password });
        const temp = await newEmployer.save();
        req.session.role = 2;
        req.session._id = temp._id;
        return res.render('dashboard', { layout: false });
    }
    return res.status(500).send({ errors: 'server error' });
});

router.post('/login', async (req, res) => {
    const  freelancerEmail = await Freelancer.findOne({email: req.body.email});
    const employerEmail = await Employer.findOne({ email: req.body.email});
    if (freelancerEmail || employerEmail) {
        return res.render('dashboard', { layout: false });
    }
    else {
        return res.render('home', { errors: 'email does not exist', layout: false });
    }
    return res.status(500).send({ errors: 'server error' });
});

module.exports = router;