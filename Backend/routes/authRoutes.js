import { Router } from "express";
import { getCurrentUser, getLogout, postLogin, postsignup } from "../controller/authController.js";
import VerifyJWT  from "../middleWare/verifyJWTmiddleware.js";

const authRouter=Router();
authRouter.post("/login",postLogin)
authRouter.post("/signup",postsignup)
authRouter.get("/getuser",VerifyJWT,getCurrentUser)
authRouter.get("/logout",VerifyJWT,getLogout)
export default authRouter;