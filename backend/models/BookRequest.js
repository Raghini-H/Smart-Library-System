const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books',
    required: true,
  },
  rentPeriod: {
    type: Number,
    default: 1,
  },
  issueDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending',
  },
  returnStatus: {
    type: String,
    enum: ['none', 'pending', 'confirmed', 'due'],
    default: 'none',
  },
}, { timestamps: true });

module.exports = mongoose.model('BookRequest', bookRequestSchema);