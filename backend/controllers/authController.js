const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { fullname,
        email,
        password,
        userid,
        department,
        phone,
        college,
        year } = req.body;

    try {
        const userExists = await User.findOne({
            $or: [{ email }, { userid }]
        });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const profile = req.file ? req.file.filename : "";

        const user = await User.create({
            fullname,
            email,
            password,
            userid,
            department,
            phone,
            college,
            year,
            profile,
        });

        if (user) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                userid: user.userid,
                message: 'User registered successfully',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: 'user'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(0),
    });
    return res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    try {
        let person = await User.findById(req.user.id).select('-password');
        if (person) {
            return res.json({ ...person._doc, type: 'user' });
        }

        person = await Employee.findById(req.user.id).select('-password');
        if (person) {
            return res.json({ ...person._doc, type: 'employee' });
        }

        person = await Admin.findById(req.user.id).select('-password');
        if (person) {
            return res.json({ ...person._doc, type: 'admin' });
        }

        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
};
