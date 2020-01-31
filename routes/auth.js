const router = require('express').Router();
const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

router.post('/register', async (req, res) => {
    if (req.body.password !== req.body.password_repeat) {
        return res.status(400).render('home', { errors: 'register', layout: false });
    }
    if (req.body.freelancer_type) {
        const newFreelancer = new Freelancer({ email: req.body.email, password: req.body.password });
        // await newFreelancer.save();
        // return res.status(201).send({ data: 'user created' });
    }
    else if (req.body.employer_type) {
        const newEmployer = new Employer({ email: req.body.email, password: req.body.password });
        // await newEmployer.save();
        // return res.status(201).send({ data: 'user created' });
    }
    return res.status(500).send({ errors: 'server error' });
});

router.post('/login', async (req, res) => {
    const email = await Freelancer.find(req.body.email);
    // return res.render()
    if (!email) {
        email = await Employer.find(req.body.email);
    }
})

module.exports = router;