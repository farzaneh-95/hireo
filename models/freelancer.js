const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');

const freelancerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 200,
        trim: true,
    },
    
    password: {
        type: String,
        required: true,
        maxlength: 200,
    },

    first_name: {
        type: String,
        maxlength: 200,
        trim: true,
    },

    last_name: {
        type: String,
        maxlength: 200,
        trim: true,
    },

    skills: [String],

    minimal_hourly_rate: {
        type: Number,
    },

    tag_line: {
        type: String,
    },

    nationality: {
        type: String,
    },

    bio: {
        type: String,
        maxlength: 10000,
    },

    rate: {
        type: Number,
        min: 0,
        max: 5,
    },

    profile_picture: String,

    success: Number,

    rec: Number,

    onTime: Number,

    onBudget: Number,

    view_count: Number,
});

freelancerSchema.plugin(mongoosePaginate);

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;