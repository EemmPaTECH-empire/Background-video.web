const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { jsPDF } = require("jspdf");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Gmail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eemmpatech@gmail.com",
    pass: "YOUR_APP_PASSWORD" // Gmail App Password
  }
});

// Weekly timetable
const timetable = {
  Monday: [
    { start: "08:00", end: "10:00", course: "GST 111" },
    { start: "10:00", end: "12:00", course: "PHYSICS 111" },
    { start: "13:00", end: "17:00", course: "PHYSICS 117" }
  ],
  Tuesday: [
    { start: "08:00", end: "10:00", course: "EEE 111" },
    { start: "10:00", end: "12:00", course: "MATH 111" },
    { start: "12:00", end: "14:00", course: "EEE PRACTICAL" },
    { start: "15:00", end: "17:00", course: "GET 111" }
  ],
  Wednesday: [
    { start: "08:00", end: "10:00", course: "PHYSICS 112" },
    { start: "10:00", end: "12:00", course: "CHEMISTRY 111" }
  ],
  Thursday: [
    { start: "10:00", end: "13:00", course: "CHEMISTRY 117" },
    { start: "15:00", end: "17:00", course: "GET 111" }
  ],
  Friday: [
    { start: "08:00", end: "10:00", course: "MATH 111" },
    { start: "11:00", end: "12:00", course: "GET 111" },
    { start: "15:00", end: "17:00", course: "GET 111" }
  ]
};

// Nigerian Time helper
function getNigeriaTime() {
  return new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" });
}

// Scheduled function
exports.sendLectureAttendance = functions.pubsub.schedule("every 5 minutes").onRun(async () => {
  const now = new Date(getNigeriaTime());
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const hour = now.getHours();
  const minute = now.getMinutes();

  if (!timetable[day]) return null;

  for (const session of timetable[day]) {
    const [endHour, endMin] = session.end.split(":").map(Number);
    if (hour === endHour && minute === endMin + 5) {
      const lecture = session.course;
      const date = now.toLocaleDateString("en-GB");

      const snapshot = await db.collection("attendance")
        .where("course", "==", lecture)
        .where("date", "==", date)
        .get();

      if (snapshot.empty) return null;

      const docContent = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        docContent.push([data.name, data.regNumber]);
      });

      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text("University of UYO", 105, 15, null, null, "center");
      pdf.setFontSize(14);
      pdf.text("100 Level Electrical & Electronic Engineering Attendance", 105, 25, null, null, "center");
      pdf.setFontSize(12);
      pdf.text(`Course: ${lecture}`, 14, 35);
      pdf.text(`Date: ${date}`, 150, 35);
      pdf.text(`Total Students: ${docContent.length}`, 14, 45);

      pdf.text("No.", 14, 55);
      pdf.text("Student Name", 30, 55);
      pdf.text("Registration Number", 150, 55);

      let y = 65;
      docContent.forEach((entry, index) => {
        pdf.text(`${index + 1}`, 14, y);
        pdf.text(entry[0], 30, y);
        pdf.text(entry[1], 150, y);
        y += 10;
      });

      const pdfData = pdf.output("arraybuffer");

      const mailOptions = {
        from: "eemmpatech@gmail.com",
        to: "eemmpatech@gmail.com",
        subject: `Attendance: ${lecture} (${date})`,
        text: `Automatic attendance list for ${lecture} on ${date}`,
        attachments: [
          {
            filename: `${lecture}-${date}.pdf`,
            content: Buffer.from(pdfData),
            contentType: "application/pdf"
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent for ${lecture} on ${date}`);
    }
  }

  return null;
});