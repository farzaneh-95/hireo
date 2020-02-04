const mongoose = require('mongoose');

const types = {
    fullTime: 1,
    freelance: 2,
    partTime: 3,
    internship: 4,
    temporary: 5,
};

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
    },

    type: {
        type: Number,
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    location: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
    },

    min_salary: {
        type: Number,
        required: true,
    },

    max_salary: {
        type: Number,
        required: true,
    },

    tags: [String],

    description: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true,
    },

    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    created_at: {
        type: Date,
        required: true,
    },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;