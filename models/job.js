const mongoose = require('mongoose');

const types = {
    fullTime: 1,
    freelance: 2,
    partTime: 3,
    internship: 4,
    temporary: 5,
};

const status = {
    Expiring: 1,
    Working: 2,
    Expired: 3,
    WaitingForApproval: 4,
};

const applySchema = new mongoose.Schema({
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Freelancer',
    },

    cv_path: {
        type: String,
        required: true,
    },

    created_at: {
        type: Date,
        requried: true,
    },
});

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
        href: 'Category',
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
        ref: 'Employer',
        required: true,
    },

    created_at: {
        type: Date,
        required: true,
    },

    status: {
        type: Number,
        required: true,
    },

    applies: [applySchema],

    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
    },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;