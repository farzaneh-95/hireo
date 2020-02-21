const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    task: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Task',
    },

    score: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },

    comment: {
        type: String,
        maxlength: 10000,
    },

    created_at: {
        type: Date,
        required: true,
        get: created_at => created_at.toDateString(),
    },
});

reviewSchema.plugin(mongoosePaginate);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;