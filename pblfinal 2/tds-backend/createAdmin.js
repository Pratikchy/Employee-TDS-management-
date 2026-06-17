const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

// ✨ Edit the details of your new Admin below ✨
const NEW_ADMIN_EMAIL = "superadmin@tdsportal.com";
const NEW_ADMIN_PASSWORD = "SuperAdmin123!";
const NEW_ADMIN_NAME = "Super Admin";

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected...");

        const existingUser = await User.findOne({ email: NEW_ADMIN_EMAIL });
        if (existingUser) {
            console.log(`❌ An account with the email ${NEW_ADMIN_EMAIL} already exists!`);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NEW_ADMIN_PASSWORD, salt);

        const adminUser = new User({
            name: NEW_ADMIN_NAME,
            email: NEW_ADMIN_EMAIL,
            password: hashedPassword,
            role: "ADMIN",
            createdBy: "System CLI",
            status: "Active"
        });

        await adminUser.save();
        console.log(`✅ Successfully created new Admin user: ${NEW_ADMIN_EMAIL}`);
        console.log(`🔑 Password: ${NEW_ADMIN_PASSWORD}`);

        mongoose.connection.close();
    } catch (e) {
        console.error("Error creating admin:", e);
        mongoose.connection.close();
    }
})();
