const router = require('express').Router();
const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

router.post('/register', async (req, res) => {
    if (await Freelancer.findOne({ email: req.body.email }) || await Employer.findOne({ email: req.body.email })){
        return res.status(400).send({ error: 'Email Already Taken' });
    }
    if (req.body.isFreelancer) {
        const freelancer = new Freelancer({ email: req.body.email, password: req.body.password });
        req.session.role = 'freelancer';
        req.session._id = await newFreelancer.save()._id;
        return res.render('dashboard', { layout: false });
    }
    else if (req.body.isEmployer) {
        const employer = new Employer({ email: req.body.email, password: req.body.password });
        req.session.role = 'employer';
        req.session._id = await employer.save()._id;
        return res.render('dashboard', { layout: false });
    }
});

router.post('/login', async (req, res) => {
    const  freelancer = await Freelancer.findOne({ email: req.body.email, password: req.body.password });
    const employer = await Employer.findOne({ email: req.body.email, password: req.body.password });
    if (freelancer) {
        req.session.role = 'freelancer';
        req.session._id = freelancer._id;
        return res.send({message: 'ok'});
    }
    else if (employer) {
        req.session.role = 'employer';
        req.session._id = employer._id;
        return res.send({message: 'ok'});
    } else {
        return res.status(400).send({ error: 'Invalid Input' });
    }
});

module.exports = router;