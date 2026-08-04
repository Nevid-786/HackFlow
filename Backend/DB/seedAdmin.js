import bcrypt from "bcryptjs";
import User from "../models/user.js";

const seedAdmin = async () => {
    try {
        const exists = await User.findOne({
            email: process.env.ADMIN_EMAIL,
        });

        if (exists) {
            console.log("✔ Admin already exists");
            return;
        }

        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

        await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hash,
            role: "admin",
            status: "approved",
        });

        console.log("✔ Admin account created");
    } catch (err) {
        console.error("Failed to seed admin:", err);
    }
};

export default seedAdmin;