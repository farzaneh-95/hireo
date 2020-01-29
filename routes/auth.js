const router = require('express').Router();
const User = require('../models/user');

router.get('/signup', (req, res) => {
    return res.render('signup', { layout: false });
});

router.post('/signup', async (req, res) => {
    const email = await User.findOne({email: req.body.email});
    if (email) {
       return res.status(400).render('signup',{ errors: 'نام کاربری یا ایمیل نامعتبر', layout: false });
    }
    if (req.body.password !== req.body.confirm_password) {
        return res.status(400).render('signup', { errors: 'رمزعبورها یکی نیستند', layout: false });
    }
    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    await user.save();
    return res.status(201).render('panel', { layout: false });
});

router.get('/signin', (req, res) => {
    return res.render('signin', { layout: false });
});

router.post('/signin', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (!user) {
        return res.status(400).render('signin', { errors: 'اطلاعات نامعتبر', layout: false });
    }
    return res.render('panel', { layout: false });
});

module.exports = router;