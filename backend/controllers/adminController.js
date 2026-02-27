const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const Books = require('../models/Books');
const User = require('../models/User');
const Plan = require('../models/Plan');
const BookRequest = require('../models/BookRequest');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const loginAdmin = async (req, res) => {
    const { name, password } = req.body;

    try {
        const admin = await Admin.findOne({ name });

        if (admin && (await admin.matchPassword(password))) {
            const token = generateToken(admin._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.json({
                _id: admin._id,
                name: admin.name,
                role: 'admin'
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerBooks = async (req, res) => {
    const { title, author, category, rent } = req.body;

    try {
        const books = await Books.create({
            title,
            author,
            category,
            rent,
        });
        res.status(201).json({
            message: "Book added successfully",
            books
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await Books.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const bookrequest = await BookRequest.find();
        res.json(bookrequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPlan = async (req, res) => {
  try {
    const { name, bookLimit, discount, description } = req.body;

    if (!name || !bookLimit || discount === undefined) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }

    const newPlan = new Plan({
      name,
      bookLimit,
      discount,
      description,
    });

    await newPlan.save();

    res.status(201).json({
      message: 'Plan added successfully',
      plan: newPlan,
    });
  } catch (error) {
    console.log("ERROR:", error); 
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
    loginAdmin,
    getAllEmployees,
    registerBooks,
    getAllBooks,
    getAllRequests,
    getAllUsers,
    addPlan,
};