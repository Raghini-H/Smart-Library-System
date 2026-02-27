const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Add full name"],
    },

    email: {
        type: String,
        required: [true, 'Add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Add a valid email',
        ],
    },

    password: {
        type: String,
        required: [true, 'Add a password'],
        minlength: 6,
    },

    userid: {
        type: String,
        required: [true, "Add user ID"],
        unique: true,
    },

    department: {
        type: String,
        required: [true, "Add department"],
    },

    phone: {
        type: String,
        required: [true, "Add phone number"],
    },

    college: {
        type: String,
        required: [true, "Add college name"],
    },

    year: {
        type: Number,
        required: [true, "Add year of study"],
        min: 1,
    },

    profile: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (pass) {
    return await bcrypt.compare(pass, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
