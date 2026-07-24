const jwt = require('jsonwebtoken');
const Books = require('../models/Books');
const User = require('../models/User');
const Plan = require('../models/Plan');
const BookRequest = require('../models/BookRequest');
const nodemailer = require('nodemailer');

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

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullname = req.body.fullname || user.fullname;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone || user.phone;
    user.college = req.body.college || user.college;
    user.year = req.body.year || user.year;

    if (req.body.password) {
      user.password = req.body.password; 
    }

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        userid: updatedUser.userid,
        department: updatedUser.department,
        phone: updatedUser.phone,
        college: updatedUser.college,
        year: updatedUser.year,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h3>Your OTP for password reset</h3>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.resetOtp !== otp ||
      user.resetOtpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

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
  getPlans,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
