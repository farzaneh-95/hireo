const isUserVerified = (req, res, next) => {
    if (req.session.role === 'employer') {
        if (!req.app.get('employer').is_verified) {
            return res.redirect('/dashboard-setting');
        }
    } else if (req.session.role === 'freelancer') {

    } else {

    }
};

module.exports = isUserVerified;