import User from "../models/user.js";
import { check, validationResult } from "express-validator";
import { objectId } from "mongodb";
import bcrypt from "bcryptjs";
import session from "express-session";
import jwt from 'jsonwebtoken';
import { generateTokens } from "../utils/generatetokens.js";
import { VerifyJWT } from "../middleware/verifyJWTmiddleware.js";

export const postsignup = [
    check('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters'),

    // Last Name validation
    check('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters'),

    check('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    // Password validation
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
    // Confirm password validation
    check('confirmPassword')

        .notEmpty()
        .withMessage('Please confirm your password')
        .trim()
        .custom((value, { req }) => {
            console.log(typeof (value), typeof (req.body.password), value === req.body.password)
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }

            return true;

        }),
    check('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['admin', 'user'])
        .withMessage('Role must be either admin or user'),


    (req, res, next) => {
        console.log("post signup", req.body)
        const { firstName, lastName, email, password, role } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(401).json({ errors: errors.array().map(err => err.msg) });
        }

        bcrypt.hash(password, 12).then((hashedpass => {
            const user = new User({ firstName, lastName, email, password: hashedpass, role });
            console.log("hashed done")
            user.save().then((msg) => {
                console.log("user created", msg);
                res.status(200).json({ _id: user._id });


            }).catch((err) => {
                console.log(err)
                return res.status(422).json({ errors: "user did not created" })

            })

        }))




    }
]

export const postLogin = async (req, res, next) => {
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
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};


export const getCurrentUser = (req, res, next) => {
    
    if (!req.user) {
        return res.status(401).json({ errors: "Not authenticated" });
    }
    res.status(200).json({ user: req.user });

}
export const getLogout = (req, res, next) => {
    // req.session.destroy();

    console.log(req.islogged)
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
}

export const getRefreshAccessToken = (req, res, next) => {
    // console.log(req.cookies);
    console.log("refresh token called for newaccess token")
    const refreshToken = req.cookies.refreshToken || "";
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ errors: "Invalid refresh token" });
        }
        const userId = decoded._id;
        User.findOne({ _id: userId, refreshToken: refreshToken }).then((user) => {
            if (!user) {
                return res.status(401).json({ errors: "user not found with this refresh token" });
            }
            const newAccessToken = jwt.sign(
                {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    profilePicture:user.profilePicture
                },
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
            )
            console.log("new access token generated", newAccessToken)
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,    // prevents JS access (safer)
                secure: false,     // true if using HTTPS
                maxAge: 1000 * 60 * 60 * 24 // optional: 1 day in ms
            }).status(200).json({"accesstoken":newAccessToken})
        });
    });
}