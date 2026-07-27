import { Router } from "express";
import { getCurrentUser, postLogin, postsignup } from "../controller/authController.js";
import VerifyJWT  from "../middleware/verifyJWTmiddleware.js";
const authRouter=Router();
authRouter.post("/login",postLogin)
authRouter.post("/signup",postsignup)
authRouter.get("/getuser",VerifyJWT,getCurrentUser)
export default authRouter;