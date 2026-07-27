import { Router } from "express";
import { postLogin } from "../controller/authController";
import { VerifyJWT } from "../middleware/verifyJWTmiddleware";
const userRouter=Router();
userRouter.post("/login",VerifyJWT,postLogin)
export default userRouter;