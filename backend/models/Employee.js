const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    employeeId: {
        type: String,
        required: [true, 'Please add an employee ID'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    }, department: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    joiningDate: {
      type: Date,
      default: null,
    },
    
    image: {
        type: String,
    },
}, {
    timestamps: true,
});

employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
