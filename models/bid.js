const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
    },
    minimal_rate: Number,
    delivery_time: {
        quantity: Number,
        type: Number,
    },
    created_at: Date,
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;