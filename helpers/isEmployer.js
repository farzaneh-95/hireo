const Employer = require('../models/employer');

const isEmployer = async (req, res, next) => {
    if (req.session.role === 'employer') {
        const employer = await Employer.findById(req.session._id);
        if (!employer) {
            return res.status(401).send({ Error: 'Unauthorized Access' });
        }
        req.app.set('employer', employer);
        return next();
    }
    res.status(401).send({ Error: 'Unauthorized Access' });
};

module.exports = isEmployer;