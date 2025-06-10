const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const os = require("os");

const generateCertificate = async (user, quiz) => {
    return new Promise((resolve, reject) => {
        const downloadsFolder = path.join(os.homedir(), "Downloads");

        console.log("📁 Downloads Folder:", downloadsFolder);

        // Ensure folder exists
        if (!fs.existsSync(downloadsFolder)) {
            console.log("⚠️ Downloads folder not found, creating...");
            fs.mkdirSync(downloadsFolder, { recursive: true });
        }

        const filePath = path.join(downloadsFolder, `${user}_certificate.pdf`);
        console.log("📄 Certificate Path:", filePath);

        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // 🎨 Add a Border
        doc
            .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .strokeColor("#4A90E2")
            .lineWidth(5)
            .stroke();

        // 🎨 Title with Styling
        doc
            .fillColor("#4A90E2")
            .fontSize(28)
            .font("Helvetica-Bold")
            .text("CERTIFICATE OF COMPLETION", { align: "center" })
            .moveDown(1);

        // 🎖️ Subtitle
        doc
            .fillColor("black")
            .fontSize(16)
            .text("This is to certify that", { align: "center" })
            .moveDown(1);

        // 👤 User Name (Large Font & Underline)
        doc
            .fillColor("#333333")
            .fontSize(24)
            .font("Helvetica-Bold")
            .text(user, { align: "center", underline: true })
            .moveDown(2);

        // 🏆 Quiz Name
        doc
            .fillColor("black")
            .fontSize(16)
            .text(`Has successfully completed the quiz:`, { align: "center" })
            .moveDown(1);

        doc
            .fillColor("#2ECC71")
            .fontSize(20)
            .font("Helvetica-Bold")
            .text(quiz, { align: "center", underline: true })
            .moveDown(2);

        // 📅 Date
        doc
            .fillColor("#444")
            .fontSize(14)
            .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" })
            .moveDown(2);

        // ✍️ Signature Line
        doc
            .moveDown(3)
            .fontSize(16)
            .fillColor("#000")
            .text("__________________", { align: "right" });

        doc
            .fillColor("#000")
            .fontSize(14)
            .text("Instructor", { align: "right" });

        // ✨ End PDF
        doc.end();

        stream.on("finish", () => {
            console.log("✅ Certificate generated successfully at:", filePath);
            resolve(filePath);
        });

        stream.on("error", (err) => {
            console.error("❌ Error generating certificate:", err);
            reject(err);
        });
    });
};

module.exports = generateCertificate;
