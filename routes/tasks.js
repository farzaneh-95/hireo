const router = require('express').Router();

const Category = require('../models/category');

router.get('/tasks', async (req, res) => {
    const categories = await Category.find({});
    res.render('dashboard-post-a-task', { data: categories, layout: false });
});

module.exports = router;