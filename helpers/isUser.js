const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

let user = {};

const isUser = async (req, res, next) => {
    if (req.session.role === 'freelancer') {
        const freelancer = await Freelancer.findById(req.session._id);
        user = freelancer;
        user.role = req.session.role;
        req.app.set('user', user);
        next();
    } else if (req.session.role === 'employer') {
        const employer = await Employer.findById(req.session._id);
        user = employer;
        user.role = req.session.role;
        req.app.set('user', user);
        next();
    } else {
        req.app.set('user', null);
        next();
    }
};

module.exports = isUser;