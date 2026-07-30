
import { Router } from "express";

import VerifyJWT  from "../middleware/verifyJWTmiddleware.js";
import { add_hackathon, getHackathon, getHackathons } from "../controller/hackathonController.js";
const hackRouter=Router();
hackRouter.post("/addhackathon",VerifyJWT,add_hackathon);
hackRouter.get("/hackathons",VerifyJWT,getHackathons);
hackRouter.get("/hackathon/:id",VerifyJWT,getHackathon);
// hackRouter.post("/signup",postsignup)
// hackRouter.get("/getuser",VerifyJWT,getCurrentUser)
export default hackRouter;