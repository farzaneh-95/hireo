const mongoose = require('mongoose');

const budgetType = {
    fixed: 1,
    hourly: 2,
};

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
        required: true,
    },

    skills: [String],

    description: {
        type: String,
        maxlength: 1000,
    },

    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;