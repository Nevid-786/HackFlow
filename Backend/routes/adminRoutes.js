// routes/admin.routes.js
import express from "express";
import { getPendingUsers, getAllMembers, approveUser, rejectUser } from "../controller/admin.controller.js";
import { isAdmin } from "../middleWare/isAdmin.js";
import VerifyJWT from "../middleWare/verifyJWTmiddleware.js";


const adminRouter = express.Router();


adminRouter.use(VerifyJWT,isAdmin);

adminRouter.get("/users/pending", getPendingUsers);
adminRouter.get("/users", getAllMembers);
adminRouter.patch("/users/:id/approve", approveUser);
adminRouter.patch("/users/:id/reject", rejectUser);

export default adminRouter;

// then in your main app file:
// app.use("/admin", adminRoutes);