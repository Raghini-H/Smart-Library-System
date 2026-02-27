const Admin = require('../models/Admin');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await Admin.findOne({ name: 'admin' });

        if (!adminExists) {
            await Admin.create({
                name: "admin",
                password: "1234",
            });
            console.log("Admin created");
        } else {
            console.log("Admin already exists");
        }
        process.exit();
    } catch (error) {
        console.error("Admin failed: ", error);
        process.exit(1);
    }
};

seedAdmin();