const mongoose = require('mongoose');

const types = ['روز', 'ساعت'];

const deliveryTimeSchema = new mongoose.Schema({
    quantity: Number,
    type: {
        type: Number,
        get: type => types[type - 1],
    }
});

const bidSchema = new mongoose.Schema({
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
    },

    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },

    minimal_rate: Number,

    delivery_time: deliveryTimeSchema,

    accepted: {
        type: Boolean,
        default: false,
    },
    
    created_at: Date,
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;