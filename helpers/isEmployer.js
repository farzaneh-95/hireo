const Employer = require('../models/employer');

const isEmployer = async (req, res, next) => {
    if (req.session.role === 'employer') {
        const employer = await Employer.findById(req.session._id);
        req.app.set('employer', employer);
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = isEmployer;