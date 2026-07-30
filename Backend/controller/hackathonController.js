import hackathonModel from "../models/hackathonModel.js";
import TRY_CATCH from "../utils/TRY_CATCH.js";

export const add_hackathon = TRY_CATCH(async (req, res, next) => {
    const {
        name,
        website,
        registrationDeadline,
        startDate,
        endDate,
        location,
        description,
        tracks,
        teamSize,
        registrationFee,
      
    } = req.body;
const createdBy=req.user._id;
    const errors = [];

    if (typeof name !== "string" || name.trim() === "") errors.push("name is required");
    if (typeof website !== "string" || website.trim() === "") errors.push("website is required");
    if (typeof registrationDeadline !== "string" || registrationDeadline.trim() === "") {
        errors.push("registrationDeadline is required");
    } else if (Number.isNaN(Date.parse(registrationDeadline))) {
        errors.push("registrationDeadline must be a valid date");
    }
    if (typeof startDate !== "string" || startDate.trim() === "") {
        errors.push("startDate is required");
    } else if (Number.isNaN(Date.parse(startDate))) {
        errors.push("startDate must be a valid date");
    }
    if (typeof endDate !== "string" || endDate.trim() === "") {
        errors.push("endDate is required");
    } else if (Number.isNaN(Date.parse(endDate))) {
        errors.push("endDate must be a valid date");
    }
    if (typeof location !== "string" || location.trim() === "") errors.push("location is required");
    if (typeof description !== "string" || description.trim() === "") errors.push("description is required");
    // if (!Array.isArray(tracks) || tracks.length === 0) errors.push("tracks must be a non-empty array");
    if (teamSize <= 0) errors.push("teamSize must be a positive number");
    // if (typeof prizePool !== "number" || prizePool < 0) errors.push("prizePool must be a valid number");
    // if (typeof registrationFee !== "number" || registrationFee < 0) errors.push("registrationFee must be a valid number");
    // if (!Array.isArray(teams) || teams.length === 0) errors.push("teams must be a non-empty array");

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }


const hackathon=await hackathonModel.create( {
        name,
        website,
        registrationDeadline,
        startDate,
        endDate,
        location,
        description,
        tracks,
        teamSize,
        registrationFee,
        createdBy,
    })
    
    if(!hackathon){
        return res.status(402).json({
            "message":"error in creating hackathon"
        })
    }
    return res.status(201).json(hackathon);

    // further handling goes here
});

export const getHackathons = TRY_CATCH(async (req, res, next) => {
try {
    const hackathons=await hackathonModel.find()
    return res.status(200).json({
        "hackathons":hackathons
    })
} catch (error) {
    console.log("getHackathons",error)
    return res.status(400).json({
        "message":"Error in geeting Hackathons",

    })
    
}


});

export const getHackathon = TRY_CATCH(async (req, res, next) => {
    const id = req.params.id;
    console.log('gethackathon......................................',id);

    if(!id){
        return res.status(400).json({
            message:"No id send by client"
        })
    }

    const hackathon= await hackathonModel.findById(id);
    
    if(!hackathon) throw new Error("No hackathon found with this id");
    return res.status(200).json({
        message:"Got the hackathon"
    ,
"hackathon":hackathon    })

    
});