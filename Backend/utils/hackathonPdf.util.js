import PDFDocument from "pdfkit";
import hackathonModel from "../models/hackathonModel.js"; // adjust path to your project
import Team from "../models/Team.js"; // adjust path to your project

// ---------- Colors ----------
// NOTE: paste your actual COLORS object here (primary, primaryDark, accent,
// cardBg, muted, text, border) — it wasn't included in the snippet you shared.
const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#312E81",
  accent: "#F5F5FF",
  cardBg: "#EEF2FF",
  muted: "#6B7280",
  text: "#111827",
  border: "#E5E7EB",
};

// ---------- Detail grid ----------
// NOTE: paste your actual drawDetailGrid implementation here — it wasn't
// included in the snippet you shared. Signature assumed below:
// drawDetailGrid(doc, pairs, x, y, width) => returns new y
const drawDetailGrid = (doc, pairs, x, yStart, width) => {
  // placeholder — replace with your existing implementation
  let y = yStart;
  const colWidth = width / 2;
  pairs.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = x + col * colWidth;
    const cy = y + row * 30;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.muted)
      .text(label, cx, cy, { width: colWidth - 10 });
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.text)
      .text(String(value), cx, cy + 12, { width: colWidth - 10 });
  });
  const rows = Math.ceil(pairs.length / 2);
  return y + rows * 30;
};

// ---------- Quick stats strip ----------
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

// ---------- Teams table ----------
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

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "N/A";

/**
 * Fetches a single hackathon + its teams from the DB.
 * Throws if the hackathon isn't found — caller decides how to handle that
 * (skip it, abort the whole request, etc.) when generating combined PDFs.
 */
export const fetchHackathonReportData = async (hackathonId) => {
  const hackathon = await hackathonModel.findById(hackathonId);
  if (!hackathon) {
    const err = new Error(`Hackathon not found: ${hackathonId}`);
    err.statusCode = 404;
    throw err;
  }

  const teams = await Team.find({ hackathonId }).populate(
    "members.userId",
    "name email"
  );

  return { hackathon, teams };
};

/**
 * Draws one hackathon's full report content onto the CURRENT page of `doc`,
 * starting at the top of the page. Does NOT call doc.addPage() itself and
 * does NOT draw per-page footers — callers control page breaks and footers,
 * since a combined PDF needs footers applied once across every buffered page.
 *
 * Returns nothing; draws directly onto `doc`.
 */
export const drawHackathonReport = (doc, hackathon, teams) => {
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
};

/**
 * Stamps "Generated on ... • Page N of M" on every buffered page of `doc`.
 * Call this once, after ALL content (single or multi-hackathon) has been drawn,
 * right before doc.end().
 */
export const stampFooters = (doc, x, pageWidth) => {
  const range = doc.bufferedPageRange();
  const savedBottomMargin = doc.page.margins.bottom;

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.page.margins.bottom = 0; // prevents PDFKit from auto-adding a page for text near the edge
    doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted)
      .text(
        `Generated on ${new Date().toLocaleString("en-US")}  •  Page ${i + 1} of ${range.count}`,
        x,
        doc.page.height - 28,
        { align: "center", width: pageWidth }
      );
    doc.page.margins.bottom = savedBottomMargin;
  }
};

/**
 * Creates a brand-new PDFDocument (A4, 40pt margin, buffered pages) —
 * shared setup used by both the single- and multi-hackathon controllers.
 */
export const createReportDocument = () =>
  new PDFDocument({ size: "A4", margin: 40, bufferPages: true });
