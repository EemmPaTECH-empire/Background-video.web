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

// Nigerian time helper
function getNigeriaTime() {
  return new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" });
}

// Determine current lecture
function getCurrentLecture() {
  const now = new Date(getNigeriaTime());
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const timeNow = now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0");

  if (!timetable[day]) return null;

  for (const session of timetable[day]) {
    if (timeNow >= session.start && timeNow <= session.end) {
      return session;
    }
  }
  return null;
}

// Display current lecture
const lectureInfo = document.getElementById("currentLecture");
const currentLecture = getCurrentLecture();

if (currentLecture) {
  lectureInfo.innerText = `Attendance for: ${currentLecture.course} (${currentLecture.start} – ${currentLecture.end})`;
} else {
  lectureInfo.innerText = "No lecture is currently ongoing.";
}

// Handle form submission
const attendanceForm = document.getElementById("attendanceForm");
const successMessage = document.getElementById("successMessage");

attendanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentLecture) {
    alert("No lecture in progress.");
    return;
  }

  const name = document.getElementById("studentName").value.trim();
  const reg = document.getElementById("regNumber").value.trim();
  const date = new Date(getNigeriaTime()).toLocaleDateString("en-GB");

  if (!name || !reg) return;

  try {
    await db.collection("attendance").add({
      name,
      regNumber: reg,
      course: currentLecture.course,
      date,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    successMessage.innerText = "Attendance submitted successfully!";
    attendanceForm.reset();
  } catch (err) {
    console.error(err);
    alert("Error submitting attendance.");
  }
});