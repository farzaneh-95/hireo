const router = require('express').Router();

const Freelancer = require('../models/freelancer');

router.get('/freelancers', async (req, res) => {
    const user = req.app.get('user');
    const query = await Freelancer.find();
    if (req.query.location) {
        query
            .where('nationality')
            .equals(req.query.location);
    }
    if (req.query.skill) {
        query
            .where('skills')
            .equals(req.query.skill);
    }
    if (req.query.tag_line) {
        query
            .where('tag_line')
            .equals(new RegExp(req.query.tag_line), 'i');
    }
    const freelancers = await Freelancer.paginate(query, { limit: 5, page: parseInt(req.query.page) });
    return res.render('freelancers-list-layout-1', {
        data: {
            user,
            freelancers: freelancers.docs,
        },
        layout: false,
    });
});

module.exports = router;