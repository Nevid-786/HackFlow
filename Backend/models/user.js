
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
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
        required: true,
        select:false
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
    }
    ,
    refreshToken: {
        type: String,
        default: null,
        select:false
    },
    profilePicture: {
        type: String,
        default: null
    },
    linkedin:{
        type:String,
        default:null
        
    },
    github:{
        type:String,
        default:null

    }

},
    {
        timestamps: true
    }

);

export default mongoose.model("User", userSchema);