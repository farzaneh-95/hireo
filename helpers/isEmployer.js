const isEmployer = async (req, res, next) => {
    if (req.session.role === 'employer') {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = isEmployer;