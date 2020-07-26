const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const types = ['Full Time', 'Freelance', 'Part Time', 'Internship', 'Temporary'];

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

    phone: {
        type: String,
        required:true,
    },

    cv_path: {
        type: String,
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
        get: type => types[type],
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
        get: min_salary => min_salary >= 1000 ? (min_salary / 1000).toString() + 'k' : min_salary,
    },

    max_salary: {
        type: Number,
        required: true,
        get: max_salary => max_salary >= 1000 ? (max_salary / 1000).toString() + 'k' : max_salary,
    },

    tags: [String],

    description: {
        type: String,
        required: true,
        maxlength: 10000,
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
        get: created_at => created_at.toDateString(),
    },

    status: {
        type: Number,
        default: 1,
        required: true,
    },

    applies: [applySchema],

    freelancer_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
    }],
});

jobSchema.plugin(mongoosePaginate);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;