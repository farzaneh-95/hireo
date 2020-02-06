const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

const isUser = async (req, res, next) => {
    if (req.session.role === 'freelancer') {
        const freelancer = await Freelancer.findById(req.session._id);
        req.app.set('user', freelancer);
        next();
    } else if (req.session.role === 'employer') {
        console.log('isEmployer');
        const employer = await Employer.findById(req.session._id);
        req.app.set('user', employer);
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = isUser;