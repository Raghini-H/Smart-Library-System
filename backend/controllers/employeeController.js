const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const BookRequest = require('../models/BookRequest');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerEmployee = async (req, res) => {
    const { name, email, employeeId, password } = req.body;

    try {
        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const employee = await Employee.create({
            name,
            email,
            employeeId,
            password,
            image: req.file ? req.file.filename : null,
        });

        if (employee) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Employee Credentials',
                text: `Hello ${name},\n\nYour account has been created.\n\nEmployee ID: ${employeeId}\nPassword: ${password}\n\nPlease keep these credentials safe.`,
            };

            await transporter.sendMail(mailOptions);

            res.status(201).json({
                message: 'Employee registered and email sent successfully',
                employee: {
                    id: employee._id,
                    name: employee.name,
                    email: employee.email,
                },
            });
        } else {
            res.status(400).json({ message: 'Invalid employee data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const loginEmployee = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ email });

        if (employee && (await employee.matchPassword(password))) {
            const token = generateToken(employee._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.json({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                role: 'employee'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}).select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getRequests = async (req, res) => {
    try {
        const requests = await BookRequest.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'fullname email')
            .populate('book', 'title author category rent');
        const clean = requests.filter(r => r.book && r.user);
        res.json(clean);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await BookRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        const previousStatus = request.status;
        request.status = status;

       
        if (status === 'approved' && previousStatus !== 'approved') {
            const now = new Date();
            request.issueDate = now;

            const months = request.rentPeriod || 1;
            const due = new Date(now);
            due.setMonth(due.getMonth() + months);
            request.dueDate = due;
        }

        await request.save();

        res.json({ message: `Request ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReturnRequests = async (req, res) => {
    try {
        const requests = await BookRequest.find({
            $or: [
                { status: 'approved' },
                { returnStatus: { $ne: 'none' } },
            ],
        })
            .sort({ createdAt: -1 })
            .populate('user', 'fullname email')
            .populate('book', 'title author category rent');

        const clean = requests.filter(r => r.book && r.user);
        res.json(clean);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const requestReturnFromUser = async (req, res) => {
    try {
        const request = await BookRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (request.status !== 'approved') {
            return res.status(400).json({ message: 'Only approved (issued) books can be marked as return due' });
        }

        if (request.returnStatus === 'pending') {
            return res.status(400).json({ message: 'User already requested return' });
        }

        request.returnStatus = 'due';
        await request.save();

        res.json({ message: 'Return requested from user' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const confirmReturn = async (req, res) => {
    try {
        const request = await BookRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (request.returnStatus !== 'pending') {
            return res.status(400).json({ message: 'No pending return for this request' });
        }

        request.returnStatus = 'confirmed';
        request.status = 'returned';
        await request.save();

        res.json({ message: 'Book return confirmed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    registerEmployee,
    loginEmployee,
    getAllEmployees,
    getRequests,
    updateRequestStatus,
    getReturnRequests,
    confirmReturn,
    requestReturnFromUser
};
