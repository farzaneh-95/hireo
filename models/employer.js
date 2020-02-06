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

    name: {
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

    logo: {
        type: String,
    },

    location: {
        type: String,
        maxlength: 100,
        trim: true,
    },
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;