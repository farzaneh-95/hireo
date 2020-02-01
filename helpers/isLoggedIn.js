const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

const isLoggedIn = async (req, res, next) => {
    if (req.session.role === 'freelancer') {
        const freelancer = await Freelancer.findById(req.session._id);
        if (!freelancer) {
            return res.render('/');
        }
        req.app.set('freelancer', freelancer);
    } else if (req.session.role === 'employer') {
        const employer = await Employer.findById(req.session._id);
        if (!employer) {
            return res.render('/');
        }
        req.app.set('employer', employer);
    }
    next();
};

module.exports = isLoggedIn