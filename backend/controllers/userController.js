const jwt = require('jsonwebtoken');
const Books = require('../models/Books');
const Plan = require('../models/Plan');
const BookRequest = require('../models/BookRequest');

const searchForBooks = async (req, res) => {
    try {
        const books = await Books.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const requestBook = async (req, res) => {
  try {
    const { bookId, rentPeriod } = req.body;

    if (!rentPeriod || Number.isNaN(Number(rentPeriod)) || Number(rentPeriod) <= 0) {
      return res.status(400).json({ message: 'Valid rent period is required' });
    }

    const exists = await BookRequest.findOne({
      user: req.user.id,
      book: bookId,
      status: 'pending',
    });

    if (exists) {
      return res.status(400).json({ message: 'Request already pending' });
    }

    const request = await BookRequest.create({
      user: req.user.id,
      book: bookId,
      rentPeriod: Number(rentPeriod),
    });

    res.status(201).json({ message: 'Request sent to employee', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({ user: req.user.id })
      .populate('book', 'title author rent')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyIssuedBooks = async (req, res) => {
  try {
    const requests = await BookRequest.find({
      user: req.user.id,
      status: { $in: ['approved', 'returned'] },
    })
      .populate('book', 'title author rent')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BookRequest.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved books can be returned' });
    }

    if (request.returnStatus === 'pending') {
      return res.status(400).json({ message: 'Return already pending' });
    }

    request.returnStatus = 'pending';
    await request.save();

    res.json({ message: 'Return request sent to employee', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    searchForBooks,
    requestBook,
    getMyRequests,
    getMyIssuedBooks,
    requestReturn,
    getPlans
};
