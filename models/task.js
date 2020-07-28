const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const persianDate = require('persian-date');

const budgetType = ['ثابت', 'ساعتی'];

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
        get: created_at => new persianDate(created_at.getTime()).format('LL'),
        required: true,
    },
    status: {
        type: Number,
        require: true,
        default: 1,
    },
});

taskSchema.plugin(mongoosePaginate);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;