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
    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
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

// ---------- Quick stats strip (fills space usefully, not just decoratively) ----------
const drawStatsStrip = (doc, x, yStart, width, teams) => {
  const totalTeams = teams.length;
  const totalParticipants = teams.reduce((sum, t) => sum + t.members.length, 0);
  const avgTeamSize = totalTeams ? (totalParticipants / totalTeams).toFixed(1) : "0";

  const stats = [
    { label: "TOTAL TEAMS", value: String(totalTeams) },
    { label: "TOTAL PARTICIPANTS", value: String(totalParticipants) },
    { label: "AVG. TEAM SIZE", value: avgTeamSize },
  ];

  const cardGap = 14;
  const cardWidth = (width - cardGap * 2) / 3;
  const cardHeight = 54;

  stats.forEach((stat, i) => {
    const cx = x + i * (cardWidth + cardGap);
    doc.roundedRect(cx, yStart, cardWidth, cardHeight, 6).fill(COLORS.cardBg);
    doc.font("Helvetica-Bold").fontSize(20).fillColor(COLORS.primaryDark)
      .text(stat.value, cx, yStart + 10, { width: cardWidth, align: "center" });
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(COLORS.muted)
      .text(stat.label, cx, yStart + 36, { width: cardWidth, align: "center" });
  });

  return yStart + cardHeight;
};

// ---------- Teams table (background painted once per row, before text) ----------
const drawTeamsTable = (doc, x, yStart, width, teams) => {
  const colWidths = { team: 120, leader: 105, members: width - 225 };
  const headerHeight = 26;
  const rowPaddingY = 8;
  let y = yStart;

  doc.rect(x, y, width, headerHeight).fill(COLORS.primary);
  doc.fillColor("white").font("Helvetica-Bold").fontSize(10);
  doc.text("Team Name", x + 10, y + 8, { width: colWidths.team - 10 });
  doc.text("Leader", x + colWidths.team + 10, y + 8, { width: colWidths.leader - 10 });
  doc.text("Members", x + colWidths.team + colWidths.leader + 10, y + 8, {
    width: colWidths.members - 18,
  });
  y += headerHeight;

  teams.forEach((team, i) => {
    const leader = team.members.find((m) => m.role === "Leader");
    const memberNames = team.members
      .map((m) => {
        const name = m.userId?.name ?? "Unknown user";
        return m.role === "Leader" ? `${name} (Leader)` : name;
      })
      .join(", ");

    doc.font("Helvetica").fontSize(9.5);
    const memberTextHeight = doc.heightOfString(memberNames || "—", {
      width: colWidths.members - 18,
    });
    const rowHeight = Math.max(28, memberTextHeight + rowPaddingY * 2);

    if (i % 2 === 0) {
      doc.rect(x, y, width, rowHeight).fill(COLORS.accent);
    }

    doc.fillColor(COLORS.text).font("Helvetica-Bold").fontSize(9.5)
      .text(team.name, x + 10, y + rowPaddingY, { width: colWidths.team - 10 });

    doc.font("Helvetica").fillColor(COLORS.text)
      .text(leader?.userId?.name ?? "Not assigned", x + colWidths.team + 10, y + rowPaddingY, {
        width: colWidths.leader - 10,
      });

    doc.text(memberNames || "—", x + colWidths.team + colWidths.leader + 10, y + rowPaddingY, {
      width: colWidths.members - 18,
    });

    doc.moveTo(x, y + rowHeight).lineTo(x + width, y + rowHeight)
      .strokeColor(COLORS.border).lineWidth(0.5).stroke();

    y += rowHeight;
  });

  return y;
};

export const generateHackathonPdf = async (req, res) => {
  let doc;

  try {
    const { id } = req.params;

    const hackathon = await hackathonModel.findById(id);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const teams = await Team.find({ hackathonId: id }).populate(
      "members.userId",
      "name email"
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${hackathon.name.replace(/\s+/g, "_")}_report.pdf"`
    );

    doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });

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

    // ================= Header band =================
    doc.rect(0, 0, doc.page.width, 100).fill(COLORS.primary);
    doc.fillColor("white").font("Helvetica-Bold").fontSize(24)
      .text(hackathon.name, x, 28, { width: pageWidth });
    doc.font("Helvetica").fontSize(11).fillColor("#E0E7FF")
      .text(`${hackathon.mode}  •  ${hackathon.location}  •  Status: ${hackathon.status}`, x, 62);

    let y = 124;

    // ================= Hackathon details =================
    const formatDate = (d) =>
      d
        ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "N/A";

    doc.font("Helvetica-Bold").fontSize(13).fillColor(COLORS.primaryDark)
      .text("Hackathon Details", x, y);
    y += 22;

    const detailPairs = [
      ["Website", hackathon.website || "N/A"],
      ["Start Date", formatDate(hackathon.startDate)],
      ["End Date", formatDate(hackathon.endDate)],
      ["Registration Deadline", formatDate(hackathon.registrationDeadline)],
      ["Team Size Limit", String(hackathon.teamSize)],
      ["Registration Fee", `Rs. ${hackathon.registrationFee ?? 0}`],
      ["Prize Pool", `Rs. ${hackathon.prizePool ?? 0}`],
      ["Tracks", hackathon.tracks?.length ? hackathon.tracks.join(", ") : "N/A"],
    ];

    y = drawDetailGrid(doc, detailPairs, x, y, pageWidth);
    y += 10;

    doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.primaryDark).text("Description", x, y);
    y += 15;
    doc.font("Helvetica").fontSize(9.5).fillColor(COLORS.text)
      .text(hackathon.description, x, y, { width: pageWidth, align: "justify" });
    y += doc.heightOfString(hackathon.description, { width: pageWidth }) + 22;

    // ================= Quick stats strip =================
    y = drawStatsStrip(doc, x, y, pageWidth, teams);
    y += 26;

    // ================= Teams section =================
    doc.font("Helvetica-Bold").fontSize(14).fillColor(COLORS.primaryDark)
      .text(`Registered Teams (${teams.length})`, x, y);
    y += 20;

    if (teams.length === 0) {
      doc.font("Helvetica").fontSize(9.5).fillColor(COLORS.muted).text("No teams registered yet.", x, y);
      y += 20;
    } else {
      y = drawTeamsTable(doc, x, y, pageWidth, teams);
    }

    // ================= Closing signature bar =================
    y += 30;
    doc.moveTo(x, y).lineTo(x + pageWidth, y).strokeColor(COLORS.border).lineWidth(0.5).stroke();
    y += 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.primaryDark)
      .text("HackFlow", x, y, { width: pageWidth, align: "center" });
    doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted)
      .text("Official hackathon report — auto-generated", x, y + 12, { width: pageWidth, align: "center" });

    // ================= Footer (bottom margin zeroed so it never triggers a new page) =================
    const range = doc.bufferedPageRange();
    const savedBottomMargin = doc.page.margins.bottom;

    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.page.margins.bottom = 0; // prevents PDFKit from auto-adding a page for text placed near the edge
      doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted)
        .text(
          `Generated on ${new Date().toLocaleString("en-US")}  •  Page ${i + 1} of ${range.count}`,
          x,
          doc.page.height - 28,
          { align: "center", width: pageWidth }
        );
      doc.page.margins.bottom = savedBottomMargin;
    }

    doc.end();
  } catch (error) {
    console.error("Error generating hackathon PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate PDF", error: error.message });
    } else if (doc) {
      doc.end();
    } else {
      res.end();
    }
  }
};