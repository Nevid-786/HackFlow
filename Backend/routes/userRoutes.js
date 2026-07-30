import { Router } from "express";
import { getCurrentUser, postLogin, postsignup } from "../controller/authController.js";
import VerifyJWT  from "../middleware/verifyJWTmiddleware.js";
import { getusers } from "../controller/userController.js";
const userRouter=Router();
userRouter.get("/allusers",VerifyJWT,getusers)
// userRouter.post("/signup",postsignup)
// userRouter.get("/getuser",VerifyJWT,getCurrentUser)
export default userRouter;