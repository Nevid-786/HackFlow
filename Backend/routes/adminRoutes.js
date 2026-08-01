// routes/admin.routes.js
import express from "express";
import { getPendingUsers, getAllMembers, approveUser, rejectUser } from "../controller/admin.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import VerifyJWT from "../middleware/verifyJWTmiddleware.js";
// import your existing JWT-verification middleware, e.g.:
// import { verifyJWT } from "../middlewares/verifyJWT.js";

const adminRouter = express.Router();

// router.use(verifyJWT); // uncomment / adjust name to match your existing auth middleware
adminRouter.use(VerifyJWT,isAdmin);

adminRouter.get("/users/pending", getPendingUsers);
adminRouter.get("/users", getAllMembers);
adminRouter.patch("/users/:id/approve", approveUser);
adminRouter.patch("/users/:id/reject", rejectUser);

export default adminRouter;

// then in your main app file:
// app.use("/admin", adminRoutes);