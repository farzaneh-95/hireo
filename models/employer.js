const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
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
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;