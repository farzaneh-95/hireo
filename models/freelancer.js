const mongoose = require('mongoose');

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
        maxlength: 1000,
    },

    rate: {
        type: Number,
        min: 0,
        max: 5,
    },

    profile_picture: String,
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;