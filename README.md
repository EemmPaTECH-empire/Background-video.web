# University of UYO – 100 Level EEE Attendance Portal

A fully automated attendance system for 100 Level Electrical & Electronic Engineering students at the University of UYO. Students submit their **Full Name** and **Registration Number** for each lecture via a clean web portal. Attendance data is stored in **Firebase Firestore**, and at the end of each lecture, a **PDF of all submissions** is automatically generated and emailed to **eemmpatech@gmail.com**.

---

## **Features**
- Real-time attendance submission per lecture
- Automatic detection of current lecture based on preset timetable
- Attendance stored securely in Firebase
- Cloud Function generates **professional PDF** with:
  - University & course header
  - Date & lecture time
  - Numbered student list
  - Total student count
- PDF emailed automatically to lecturer’s email

---

## **Weekly Lecture Timetable**

**Monday**  
08:00 – 10:00 → GST 111  
10:00 – 12:00 → PHYSICS 111  
13:00 – 17:00 → PHYSICS 117  

**Tuesday**  
08:00 – 10:00 → EEE 111  
10:00 – 12:00 → MATH 111  
12:00 – 14:00 → EEE PRACTICAL  
15:00 – 17:00 → GET 111  

**Wednesday**  
08:00 – 10:00 → PHYSICS 112  
10:00 – 12:00 → CHEMISTRY 111  

**Thursday**  
10:00 – 13:00 → CHEMISTRY 117  
15:00 – 17:00 → GET 111  

**Friday**  
08:00 – 10:00 → MATH 111  
11:00 – 12:00 → GET 111  
15:00 – 17:00 → GET 111  

---

## **Tech Stack**
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Firebase Firestore + Cloud Functions  
- **Automation:** jsPDF + NodeMailer  
- **Hosting:** GitHub Pages  
- **Email Delivery:** Gmail (eemmpatech@gmail.com)  

---

## **Setup Instructions**

1. **Frontend:**  
   - Upload `index.html`, `style.css`, `script.js`, `firebase-config.js`, and `README.md` to GitHub  
   - Enable **GitHub Pages → main branch / root**  

2. **Firebase Backend:**  
   - Create Firebase project in console → enable Firestore  
   - Copy `firebase-config.js` values from Firebase console  
   - In Termux / CLI:  
     ```bash
     firebase login
     firebase init
     cd functions
     npm install
     firebase deploy --only functions
     ```  
   - Cloud Function handles **PDF generation and email** automatically

---

## **Author**
- **EemmPaTECH-EMPIRE**  
- © 2026