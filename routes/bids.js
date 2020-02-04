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
        type: req.body.type === 'Hours' ? 1 : 2,
    };
    const bid = new Bid({
        freelancer_id: req.session._id,
        task_id: req.body.task_id,
        minimal_rate: req.body.minimal_rate,
        delivery_time,
        created_at: new Date(), 
    });
    const saved = await bid.save();
    task.bids.push(saved._id);
    await task.save();
    return res.status(201).send({ Message: 'Ok' });
});

router.get('/task/bids', async (req, res) => {
    const bids = await Bid.find({ freelancer_id: req.session._id, is_active: true }).populate('task_id').exec();
    return res.render('dashboard-my-active-bids', {
        data: {
            bids
        },
        layout: false,
    });
});

router.post('/edit-bids', async (req, res) => {
    const delivery_time = {
        quantity: parseInt(req.body.delivery_time),
        type: req.body.type === 'Hours' ? 1 : 2,
    };
    await Bid.findOne({ freelancer_id: req.session._id, task_id: req.body.task_id }).update({ 
        minimal_rate: req.body.minimal_rate,
        delivery_time,
        created_at: new Date(),
    });
    return res.status(200).send({ Message: 'Ok' });
});

module.exports = router;