const router = require('express').Router();

const Task = require('../models/task');
const Bid = require('../models/bid');
const isFreelancer = require('../helpers/isFreelancer');



router.post('/tasks/bids', isFreelancer, async (req, res) => {
    const exists = await Bid.exists({ task_id: req.body.task_id, freelancer_id: req.session._id });
    if (exists) {
        return res.status(400).send({ Error: 'Already bid' });
    }
    const task = await Task.findById(req.body.task_id);
    const delivery_time = {
        quantity: parseInt(req.body.delivery_time),
        type: req.body.type,
    };
    const bid = new Bid({
        freelancer_id: req.session._id,
        task_id: req.body.task_id,
        minimal_rate: req.body.minimal_rate,
        delivery_time: req.body.delivery_time - 1,
        created_at: new Date(), 
    });
    await bid.save();
    return res.status(201).send({ Message: 'Ok' });
});



router.post('/tasks/edit_bids', async (req, res) => {
    const delivery_time = {
        quantity: parseInt(req.body.delivery_time),
        type: req.body.type === 'Hours' ? 1 : 2,
    };
    if (!await Task.find({ freelancer_id: req.session._id, _id: req.body.task_id, status: 1 }).exists(1)) {
        return res.status(404).send({ Error: 'Not Found' });
    }
    await Bid.findOne({ freelancer_id: req.session._id, task_id: req.body.task_id }).update({ 
        minimal_rate: req.body.minimal_rate,
        delivery_time,
        created_at: new Date(),
    });
    return res.redirect('/tasks/my_bids');
});

module.exports = router;