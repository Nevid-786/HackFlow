import Team from "../models/Team.js";
import TRY_CATCH from "../utils/TRY_CATCH.js";
import mongoose from "mongoose";

export const addTeam = TRY_CATCH( async (req, res, next) => {
    // const {}=req.body;
    try {
    const {
      name,
      hackathonId,
      maxMembers,
      createdBy,
      members = [],
    } = req.body;
    const leader_id=req.user._id;

    // Basic validation
    if (!name || !hackathonId || !createdBy) {
      return res.status(400).json({
        message: "name, hackathonId and createdBy are required",
      });
    }

    // Validate team size
    if (members.length > Number(maxMembers)) {
      return res.status(400).json({
        message: "Number of members cannot exceed maxMembers",
      });
    }

    // Remove duplicate user IDs
    const uniqueMembers = [...new Set(members)];

    // Convert:
    // ["user1", "user2"]
    //
    // into:
    // [
    //   { userId: "user1", role: "Leader" },
    //   { userId: "user2", role: "Member" }
    // ]

    const teamMembers = uniqueMembers.map((userId, index) => ({
      userId,
      role: userId==leader_id ? "Leader" : "Member",
    }));

    const team = await Team.create({
      name,
      hackathonId,
      maxMembers: Number(maxMembers),
      createdBy,
      members: teamMembers,
    });

    return res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.error("Create team error:", error);

    return res.status(500).json({
      message: "Failed to create team",
      error: error.message,
    });
  }
});

export const getTeams = TRY_CATCH(async (req, res, next) => {
  const hackid = req.params.hackid;
  if(!hackid) return res.status(400).json({
    message:"Provide hackid as param"
  })
  const query = hackid ? { hackathonId: hackid } : {};

  const teams = (await Team.find(query).populate("createdBy","name createdAt")) || [];

  return res.status(200).json({
    message: "Teams fetched successfully",
    teams,
  });
});

export const getTeam = TRY_CATCH(async (req, res, next) => {
  const team_id = req.params.team_id || req.params.id;
  if (!team_id) {
    return res.status(400).json({
      message: "Provide team_id as param",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(team_id)) {
    return res.status(400).json({
      message: "Invalid team id",
    });
  }

  const team = await Team.findById(team_id)
    .populate("createdBy").populate("members.userId")
    

  if (!team) {
    return res.status(404).json({
      message: "Team not found",
    });
  }

  return res.status(200).json({
    message: "Team fetched successfully",
    team,
  });
});
// .........................................



export const deleteTeam = TRY_CATCH( async (req, res, next) => {
   const team_id=req.params.id;
  

   let team = await Team.findById(team_id);
  if (!team) {
    const err = new Error("Team not found");
    err.status = 404;
    throw err;
  }
  const leader=team.members.find((m)=>m.role="Leader").userId;
  console.log(leader,req.user._id)
  if(req.user._id!=leader & req.user.role!="admin"){
     const err = new Error("You are not Authorized");
    err.status = 404;
    throw err;
  }
 
 
   if(!team_id) throw new Error("No team id Provided");
    team=await Team.deleteOne({ _id: team_id });
      if(!team) throw new Error("Cant Delete Team");
      console.log(team)
   return res.status(200).json({
    message:`Deleted Team`
   })

});


// POST /teams/:id/members   body: { userId }
export const addMembers = TRY_CATCH(async (req, res, next) => {
  const { id: teamId } = req.params;
  const { name="", members = [] } = req.body;

  // Remove duplicate IDs from request
  const uniqueMembers = [...new Set(members)];

  // Find team
  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({
      message: "Team not found",
    });
  }

  // Existing member IDs
  const existingMemberIds = team.members.map((m) => m.userId.toString());

  // Keep only new members
  const membersToAdd = uniqueMembers
    .filter((id) => !existingMemberIds.includes(id))
    .map((id) => ({
      userId: id,
      role: "Member",
    }));

  const update = {};

  if (name !== undefined) {
    update.$set = { name };
  }

  if (membersToAdd.length > 0) {
    update.$push = {
      members: {
        $each: membersToAdd,
      },
    };
  }

  const updatedTeam = await Team.findByIdAndUpdate(
    teamId,
    update,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    message: "Team updated successfully",
    team: updatedTeam,
  });
});



// DELETE /teams/:id/members/:userId
export const removeMember = TRY_CATCH(async (req, res) => {
  const { id, userId } = req.params;
  const currentUser=req.user._id;
  
 
  const team = await Team.findById(id);
  // console.log(team)
  if (!team) {
    const err = new Error("Team not found");
    err.status = 404;
    throw err;
  }
  const leader=team.members.find((m)=>m.role=="Leader").userId;
  console.log("User:",currentUser,"leader",leader)
if (currentUser.toString() !== leader.toString() && req.user.role !== "admin") {
    const err = new Error("You are not Authorized");
    err.status = 403;
    throw err;
}
  const target = team.members.find((m) => m.userId.toString() === userId);
  if (!target) {
    const err = new Error("Member not found");
    err.status = 404;
    throw err;
  }
 
  if (target.role === "Leader") {
    const err = new Error("Cannot remove the team leader");
    err.status = 400;
    throw err;
  }
 
  if (team.members.length <= 1) {
    const err = new Error("A team must have at least one member");
    err.status = 400;
    throw err;
  }
 
  team.members = team.members.filter((m) => m.userId.toString() !== userId);
  await team.save();
 
  res.json({ message: "Member removed", team });
});
 