import { Router } from "express";
import { getCurrentUser, postLogin, postsignup } from "../controller/authController.js";
import VerifyJWT  from "../middleWare/verifyJWTmiddleware.js";
import { deleteUser, getUserById, getusers, updateProfile } from "../controller/userController.js";
const userRouter=Router();
userRouter.get("/allusers",VerifyJWT,getusers)
userRouter.patch("/update/profile",VerifyJWT,updateProfile)
userRouter.get("/user/:userId",VerifyJWT,getUserById)
userRouter.get("/delete/:userId",VerifyJWT,deleteUser)
// userRouter.post("/signup",postsignup)
// userRouter.get("/getuser",VerifyJWT,getCurrentUser)
export default userRouter;