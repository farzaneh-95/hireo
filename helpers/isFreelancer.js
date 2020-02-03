const Freelancer = require('../models/freelancer');

const isFreelancer = async (req, res, next) => {
    if (req.session.role === 'freelancer') {
        const freelancer = await Freelancer.findById(req.session._id);
        if (!freelancer) {
            return res.status(401).send({ Error: 'Unauthorized Access' });
        }
        req.app.set('freelancer', freelancer);
        return next();
    }
    res.status(401).send({ Error: 'Unauthorized Access' });
};

module.exports = isFreelancer