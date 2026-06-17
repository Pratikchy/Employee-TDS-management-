const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@tdsportal.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!";

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected for reset...");

        await User.deleteMany({});
        console.log("Cleared existing users.");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const adminUser = new User({
            name: "System Admin",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "ADMIN"
        });

        await adminUser.save();
        console.log("Successfully created new Admin user!");

        mongoose.connection.close();
    } catch (e) {
        console.error("Error:", e);
        mongoose.connection.close();
    }
})();
