const admin = require("firebase-admin");

// Cloud Run par credentials dene ki zaroorat nahi hoti, ye khud detect kar lega!
try {
    if (!admin.apps.length) {
        admin.initializeApp({
            // Apna project ID zaroor daalna yahan
            projectId: "agent-assessment"
        });
    }
    console.log("🔥 Database connected automatically!");
} catch (error) {
    console.error("Database connection failed:", error);
}

const db = admin.firestore();
module.exports = db;