const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

const isLoggedIn = async (req, res, next) => {
    if (req.session.role === 'freelancer') {
        if (!await Freelancer.findById(req.session._id)) {
            res.redirect('/');
        }
        next();
    } else if (req.session.role === 'employer') {
        if (!await Employer.findById(req.session._id)) {
            res.redirect('/');
        }
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = isLoggedIn