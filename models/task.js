const mongoose = require('mongoose');

const budgetType = {
    fixed: 1,
    hourly: 2,
};

const status = {
    Expiring: 1,
    Working: 2,
    Done: 3,
    Expired: 4,
};

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

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 200,
        required: true,
    },

    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
    },

    employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
    },

    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },

    location: {
        type: String,
    },

    min_budget: {
        type: Number,
        min: 1,
    },

    max_budget: {
        type: Number,
        min:1,
    },

    budget_type: {
        type: Number,
    },

    skills: [String],

    description: {
        type: String,
        maxlength: 1000,
        required: true,
    },

    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],

    created_at: Date,

    status: Number,

    reviews: [reviewSchema],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;