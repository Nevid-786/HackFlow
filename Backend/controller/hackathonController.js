import hackathonModel from "../models/hackathonModel.js";
import TRY_CATCH from "../utils/TRY_CATCH.js";
import PDFDocument from "pdfkit";
import Team from "../models/Team.js";

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


export const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params
    console.log(req.body)
    const {
      name,
      website,
      registrationLink,
      registrationDeadline,
      startDate,
      endDate,
      location,
      mode,
      description,
      tracks,
      teamSize,
      prizePool,
      registrationFee,
      banner,
    } = req.body

    const hackathon = await hackathonModel.findById(id)

    if (!hackathon) {
      return res.status(404).json({ errors: ["Hackathon not found"] })
    }

    // only the creator can update
    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ errors: ["Not authorized to update this hackathon"] })
    }

    if (name !== undefined) hackathon.name = name
    if (website !== undefined) hackathon.website = website
    if (registrationLink !== undefined) hackathon.registrationLink = registrationLink
    if (registrationDeadline !== undefined) hackathon.registrationDeadline = registrationDeadline
    if (startDate !== undefined) hackathon.startDate = startDate
    if (endDate !== undefined) hackathon.endDate = endDate
    if (location !== undefined) hackathon.location = location
    if (mode !== undefined) hackathon.mode = mode
    if (description !== undefined) hackathon.description = description
    if (tracks !== undefined) hackathon.tracks = tracks
    if (teamSize !== undefined) hackathon.teamSize = teamSize
    if (prizePool !== undefined) hackathon.prizePool = prizePool
    if (registrationFee !== undefined) hackathon.registrationFee = registrationFee
    if (banner !== undefined) hackathon.banner = banner

    await hackathon.save()

    return res.status(200).json({
      message: "Hackathon updated successfully",
      hackathon,
    })
  } catch (error) {
    console.log(error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ errors: messages })
    }

    if (error.name === "CastError") {
      return res.status(400).json({ errors: ["Invalid hackathon id"] })
    }

    return res.status(500).json({ errors: ["Something went wrong"] })
  }
}

export const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params

    const hackathon = await hackathonModel.findById(id)

    if (!hackathon) {
      return res.status(404).json({ errors: ["Hackathon not found"] })
    }

    // only the creator can delete
    if (hackathon.createdBy.toString() !== req.user._id.toString()&&req.user.role!=="admin") {
      return res.status(403).json({ errors: ["Not authorized to delete this hackathon"] })
    }

    await hackathonModel.findByIdAndDelete(id)

    return res.status(200).json({
      message: "Hackathon deleted successfully",
    })
  } catch (error) {
    console.log(error)

    if (error.name === "CastError") {
      return res.status(400).json({ errors: ["Invalid hackathon id"] })
    }

    return res.status(500).json({ errors: ["Something went wrong"] })
  }
}

const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  accent: "#EEF2FF",
  border: "#C6C4D9",
  text: "#1E293B",
  muted: "#64748B",
  cardBg: "#F5F4FF",
};

// ---------- 2-column label/value grid ----------
const drawDetailGrid = (doc, pairs, x, yStart, totalWidth) => {
  const colGap = 24;
  const colWidth = (totalWidth - colGap) / 2;
  const rowGap = 14;
  let y = yStart;

  for (let i = 0; i < pairs.length; i += 2) {
    const rowPairs = pairs.slice(i, i + 2);
    let maxHeight = 0;

    rowPairs.forEach(([label, value], idx) => {
      const cx = x + idx * (colWidth + colGap);

      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.muted)
        .text(label.toUpperCase(), cx, y, { width: colWidth });
      const labelHeight = doc.heightOfString(label.toUpperCase(), { width: colWidth });

      doc.font("Helvetica").fontSize(11).fillColor(COLORS.text)
        .text(value, cx, y + labelHeight + 3, { width: colWidth });
      const valueHeight = doc.heightOfString(value, { width: colWidth });

      maxHeight = Math.max(maxHeight, labelHeight + valueHeight + 3);
    });

    y += maxHeight + rowGap;
  }

  return y;
};



export const getMyHackathons = TRY_CATCH(async (req, res, next) => {
    const userId = req.user._id;
 
    const teams = await Team.find({ "members.userId": userId })
        .populate("hackathonId")
        .lean();
 
    const myHackathons = teams
        .filter((team) => team.hackathonId) // skip if hackathon was deleted
        .map((team) => {
            const membership = team.members.find(
                (m) => m.userId.toString() === userId.toString()
            );
 
            return {
                hackathon: team.hackathonId,
                team: {
                    _id: team._id,
                    name: team.name,
                    role: membership?.role || "Member",
                    memberCount: team.members.length,
                    maxMembers: team.maxMembers,
                },
            };
        })
        .sort((a, b) => new Date(a.hackathon.startDate) - new Date(b.hackathon.startDate));
 
    return res.status(200).json({
        success: true,
        data: myHackathons,
    });
});


import {
  createReportDocument,
  fetchHackathonReportData,
  drawHackathonReport,
  stampFooters,
} from "../utils/hackathonPdf.util.js"; // adjust path to your project

/**
 * GET /hackathons/:id/pdf
 * Single-hackathon report — same output as before, just refactored to use
 * the shared utility.
 */
export const generateHackathonPdf = async (req, res) => {
  let doc;
console.log("generateHackathonPdf called with params:", req.params);
  try {
    const { id } = req.params;
    const { hackathon, teams } = await fetchHackathonReportData(id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${hackathon.name.replace(/\s+/g, "_")}_report.pdf"`
    );

    doc = createReportDocument();

    doc.on("error", (err) => {
      console.error("PDF stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to generate PDF" });
      } else {
        res.end();
      }
    });

    doc.pipe(res);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const x = doc.page.margins.left;

    drawHackathonReport(doc, hackathon, teams);
    stampFooters(doc, x, pageWidth);

    doc.end();
  } catch (error) {
    console.error("Error generating hackathon PDF:", error);
    if (!res.headersSent) {
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message || "Failed to generate PDF" });
    } else if (doc) {
      doc.end();
    } else {
      res.end();
    }
  }
};

/**
 * POST /hackathons/pdf/combined
 * Body: { hackathonIds: string[] }
 *
 * Fetches each hackathon + its teams, and renders each one onto its own
 * fresh page(s) inside a single combined PDF. Unknown/missing hackathon ids
 * are collected and skipped rather than failing the whole request — the
 * skipped ids are reported back via the `X-Skipped-Hackathons` header since
 * the response body itself is the PDF stream.
 */
export const generateCombinedHackathonsPdf = async (req, res) => {
  let doc;
  console.log("generateCombinedHackathonsPdf called with body:", req.body);

  try {
    const hackathonIds = req.body?.hackathonIds;

    if (!Array.isArray(hackathonIds) || hackathonIds.length === 0) {
      return res.status(400).json({ message: "hackathonIds must be a non-empty array" });
    }

    // Fetch everything up front so we fail fast on total garbage input
    // before any bytes are written to the response.
    const results = await Promise.allSettled(
      hackathonIds.map((id) => fetchHackathonReportData(id))
    );

    const reports = [];
    const skipped = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        reports.push(result.value);
      } else {
        skipped.push(hackathonIds[i]);
        console.warn(`Skipping hackathon ${hackathonIds[i]}: ${result.reason.message}`);
      }
    });

    if (reports.length === 0) {
      return res.status(404).json({ message: "None of the requested hackathons were found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="combined_hackathons_report.pdf"`);
    if (skipped.length > 0) {
      res.setHeader("X-Skipped-Hackathons", skipped.join(","));
    }

    doc = createReportDocument();

    doc.on("error", (err) => {
      console.error("PDF stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to generate PDF" });
      } else {
        res.end();
      }
    });

    doc.pipe(res);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const x = doc.page.margins.left;

    reports.forEach(({ hackathon, teams }, i) => {
      if (i > 0) doc.addPage();
      drawHackathonReport(doc, hackathon, teams);
    });

    // Footers are stamped once at the end, across every buffered page from
    // every hackathon, so page numbers are continuous through the whole file.
    stampFooters(doc, x, pageWidth);

    doc.end();
  } catch (error) {
    console.error("Error generating combined hackathon PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate PDF", error: error.message });
    } else if (doc) {
      doc.end();
    } else {
      res.end();
    }
  }
};




