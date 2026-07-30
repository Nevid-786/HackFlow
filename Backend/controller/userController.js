import user from "../models/user.js";
import TRY_CATCH from "../utils/TRY_CATCH.js";


export const getusers = TRY_CATCH( async (req, res, next) => {
    const users= await user.find();
    if(!users) {return res.status(400).json({
        message:"No users Found"
    })};
    
    return res.status(200).json({
        "users":users
    })
});