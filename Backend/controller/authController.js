import User from "../models/user.js";
import { check, validationResult } from "express-validator";
// import { objectId } from "mongodb";
import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken';
import { generateTokens } from "../utils/generatetokens.js";
import VerifyJWT from "../middleWare/verifyJWTmiddleware.js";
export const postsignup = [
    check('name')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters'),

    check('email')
        .isEmail()
        .withMessage('Please enter a valid email'),

    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(), .? ":{}|<>]/)
        .withMessage('Password must contain at least one special character')
        .trim(),

    check('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm your password')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    (req, res, next) => {
        const { name, email, password } = req.body;
        const role = "user";

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array().map(err => err.msg) });
        }

        bcrypt.hash(password, 12).then((hashedpass => {
            // status defaults to 'pending' via the schema — account exists
            // but can't log in until an admin approves it
            const user = new User({ name, email, password: hashedpass, role, status: 'pending' });

            user.save().then((savedUser) => {
                res.status(200).json({
                    _id: savedUser._id,
                    message: "Signup request received. An admin needs to approve your account before you can log in.",
                });
            }).catch((err) => {
                console.log(err)
                return res.status(422).json({ errors: "user did not created" })
            })

        }))
    }
]
export const postLogin = async (req, res, next) => {
    console.log(req.url,req.body)
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ errors: ["Invalid email or password" ]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ errors: ["Invalid email or password"] });
        }

        // block login until an admin has approved the signup request
        if (user.status === 'pending') {
            return res.status(403).json({ errors: ["Your account is awaiting admin approval."] });
        }

        if (user.status === 'rejected') {
            return res.status(403).json({ errors: ["Your signup request was rejected."] });
        }

        const {accessToken,refreshToken}=generateTokens(user);
           console.log("postlogin",accessToken);
        user =await User.findOneAndUpdate({_id:user._id},{$set:{refreshToken:refreshToken}});
        
        if (!user) {
            return res.status(401).json({ errors: ["user refresh token not updated"] });
        }

     console.log("refresh token updated in db",user)

        // req.session.islogged = true;

        return res.
            cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }).
            cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }).status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                profilePicture: user.profilePicture
            });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

export const getLogout = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
};
export const getCurrentUser = (req, res, next) => {
    
    if (!req.user) {
        return res.status(401).json({ errors: "Not authenticated" });
    }
    res.status(200).json({ user: req.user });

}