const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
    },

    employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
    },

    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },

    delivered_on_budget: {
        type: Boolean,
        required: true,
    },

    delivered_on_time: {
        type: Boolean,
        required: true,
    },

    rate: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },

    comment: {
        type: String,
        maxlength: 100,
    },

    created_at: {
        type: Date,
    },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;