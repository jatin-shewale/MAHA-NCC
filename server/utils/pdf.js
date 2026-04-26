import PDFDocument from "pdfkit";

export const createPerformanceReport = ({ cadet, stats }) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).fillColor("#102542").text("Monthly Performance Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).fillColor("#1f2937").text(`Cadet: ${cadet.name}`);
    doc.text(`Cadet ID: ${cadet.cadetId}`);
    doc.text(`Rank: ${cadet.rank || "N/A"}`);
    doc.text(`Wing: ${cadet.wing || "N/A"}`);
    doc.moveDown();

    doc.fontSize(16).text("Summary");
    doc.fontSize(12);
    doc.text(`Attendance Rate: ${stats.attendanceRate}%`);
    doc.text(`Approved Achievements: ${stats.approvedAchievements}`);
    doc.text(`Camp Applications: ${stats.campApplications}`);
    doc.text(`Leaderboard Score: ${stats.leaderboardScore}`);
    doc.text(`Badge Level: ${stats.badgeLevel}`);

    doc.moveDown();
    doc.fontSize(16).text("Command Note");
    doc.fontSize(12).text(
      stats.attendanceRate >= 85
        ? "Cadet is maintaining strong operational readiness and consistent attendance."
        : "Cadet should improve consistency in attendance and training participation."
    );

    doc.end();
  });
