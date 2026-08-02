import User from "../models/user.js";
import TRY_CATCH from "../utils/TRY_CATCH.js";


export const getusers = TRY_CATCH( async (req, res, next) => {
    const users= await User.find();
    if(!users) {return res.status(400).json({
        message:"No users Found"
    })};
    
    return res.status(200).json({
        "users":users
    })
});


export const getUserById = TRY_CATCH(async (req, res, next) => {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
        user: user
    });
});



export const updateProfile = TRY_CATCH(async (req, res, next) => {
    const userId = req.user._id;
 
    const { name, email, profilePicture, linkedin, github } = req.body;
 
    const errors = [];
 
    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
        errors.push("name cannot be empty");
    }
    if (email !== undefined && (typeof email !== "string" || email.trim() === "")) {
        errors.push("email cannot be empty");
    }
    if (linkedin !== undefined && linkedin !== null && typeof linkedin !== "string") {
        errors.push("linkedin must be a string");
    }
    if (github !== undefined && github !== null && typeof github !== "string") {
        errors.push("github must be a string");
    }
 
    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }
 
    const user = await User.findById(userId);
 
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
 
    // if email is changing, make sure it's not already taken
    if (email !== undefined && email.trim().toLowerCase() !== user.email) {
        const existing = await User.findOne({ email: email.trim().toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }
        user.email = email.trim().toLowerCase();
    }
 
    if (name !== undefined) user.name = name.trim();
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;
 
    await user.save();
 
    const safeUser = await User.findById(userId); // password/refreshToken excluded by select:false
 
    return res.status(200).json({
        message: "Profile updated successfully",
        user: safeUser,
    });
});


export const deleteUser = TRY_CATCH(async (req, res, next) => {
    const { userId } = req.params;
    // console.log("userId:", userId);
    const requesterId = req.user && req.user._id && req.user._id.toString();
    const requesterRole = req.user && req.user.role;

    if (!requesterId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (requesterId !== userId && requesterRole !== 'admin') {
        return res.status(403).json({ message: "Forbidden: cannot delete this user" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully" });
});
 