const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    project_name: {
        type: String,
        maxlength: 200,
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
    budget: {
        type: Number,
        min: 0,
    },
    project_type: {
        type: Number,
    },
    skills: [String],
    project_disc: {
        type: String,
        maxlength: 1000,
        required: true,
    },
    project_file: {
        type: String,
    },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;