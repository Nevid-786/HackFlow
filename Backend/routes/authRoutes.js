import { Router } from "express";
import { getCurrentUser, getLogout, postLogin, postsignup } from "../controller/authController.js";
import VerifyJWT  from "../middleWare/verifyJWTmiddleware.js";
import { apiLimiter, authLimiter, currentUserLimiter } from "../middleWare/rateLimiter.js";
const authRouter=Router();
authRouter.post("/login",authLimiter,postLogin)
authRouter.post("/signup",authLimiter,postsignup)
authRouter.get("/getuser",currentUserLimiter,VerifyJWT,getCurrentUser)
authRouter.get("/logout",VerifyJWT,getLogout)
export default authRouter;