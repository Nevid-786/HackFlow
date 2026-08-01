
import { Router } from "express";

import VerifyJWT  from "../middleware/verifyJWTmiddleware.js";
import { add_hackathon, deleteHackathon, generateCombinedHackathonsPdf, generateHackathonPdf, getHackathon, getHackathons, getMyHackathons, updateHackathon } from "../controller/hackathonController.js";
const hackRouter=Router();
hackRouter.post("/addhackathon",VerifyJWT,add_hackathon);
hackRouter.get("/hackathons",VerifyJWT,getHackathons);
hackRouter.get("/hackathon/:id",VerifyJWT,getHackathon);
hackRouter.post("/hackathon/update/:id",VerifyJWT,updateHackathon);
hackRouter.get("/hackathon/delete/:id",VerifyJWT,deleteHackathon);
hackRouter.get("/hackathon/pdf/:id",VerifyJWT,generateHackathonPdf);
hackRouter.post("/hackathons/pdf/combined",VerifyJWT,generateCombinedHackathonsPdf);
hackRouter.get("/me/hackathons", VerifyJWT, getMyHackathons);
// hackRouter.post("/signup",postsignup)
// hackRouter.get("/getuser",VerifyJWT,getCurrentUser)
export default hackRouter;

