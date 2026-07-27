const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    
        role: {
            type: String,
            enum: ['admin', 'user'],    
    }
    ,
        refreshToken: {
            type: String,
            default: null
        },
        profilePicture: {
            type: String,
             default: null
        }
    
  },
      {
timestamps: true
      }
    
);

module.exports = mongoose.model("User", userSchema);