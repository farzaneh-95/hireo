const mongoose = require('mongoose');

const types = {
    Hours: 1,
    Days: 2,
};

const deliveryTimeSchema = new mongoose.Schema({
    quantity: Number,
    type: Number,
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

    is_active: Boolean,
    
    created_at: Date,
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;