const isFreelancer = async (req, res, next) => {
    if (req.session.role === 'freelancer') {
        const freelancer = req.app.get('user');
        if (!freelancer) {
            return res.status(401).send({ Error: 'Unauthorized Access' });
        }
        return next();
    }
    res.status(401).send({ Error: 'Unauthorized Access' });
};

module.exports = isFreelancer