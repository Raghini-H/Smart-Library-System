const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    author: {
        type: String,
        required: [true, 'Please add the author name'],
    },
    bookcover: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        required: [true, 'Please add category'],
    },
    rent: {
        type: String,
        required: [true, 'Please add rent fees'],
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Books', bookSchema);
