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
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;