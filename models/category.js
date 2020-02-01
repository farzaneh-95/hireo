const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 200,
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;