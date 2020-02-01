const Freelancer = require('../models/freelancer');
const Employer = require('../models/employer');

const isLoggedIn = async (req, res, next) => {
    if (req.cookies.role === 'freelancer') {
        const freelancer = await Freelancer.findById(req.cookies._id);
        if (!freelancer) {
            return res.render('home', { layout: false });
        }
        req.app.set('freelancer', freelancer);
        return next();
    } else if (req.cookies.role === 'employer') {
        const employer = await Employer.findById(req.cookies._id);
        if (!employer) {
            return res.render('home');
        }
        req.app.set('employer', employer);
        return next();
    }
    return res.render('home', { layout: false });
};

module.exports = isLoggedIn