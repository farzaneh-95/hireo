const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const budgetType = ['ثابت', 'ساعتی'];

const status = {
    Working: 1,
    Expired: 2,
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
        required: true,
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
        get: type => budgetType[type],
    },

    skills: [String],

    description: {
        type: String,
        maxlength: 10000,
        required: true,
    },

    created_at: {
        type: Date,
        get: created_at => created_at.toDateString(),
        required: true,
    },

    status: Number,
});

taskSchema.plugin(mongoosePaginate);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;