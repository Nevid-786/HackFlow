

import { Router } from "express";
import { getCurrentUser, postLogin, postsignup } from "../controller/authController.js";
import VerifyJWT from "../middleWare/verifyJWTmiddleware.js";
import {
  addTeam,
  deleteTeam,
  getTeam,
  getTeams,
  removeMember,
  addMembers
} from "../controller/teamController.js";

 
const teamRouter = Router();
 
teamRouter.post("/addteam", VerifyJWT, addTeam);
teamRouter.get("/teams/:hackid", VerifyJWT, getTeams);
teamRouter.get("/deleteteam/:id", VerifyJWT, deleteTeam);
teamRouter.get("/team/:id", VerifyJWT, getTeam);
 
teamRouter.post("/team/:id/members", VerifyJWT, addMembers);
teamRouter.delete("/team/:id/members/:userId", VerifyJWT, removeMember);
 
// teamRouter.post("/signup",postsignup)
// teamRouter.get("/getuser",VerifyJWT,getCurrentUser)
export default teamRouter;
 