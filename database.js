const admin = require("firebase-admin");

// Apni downloaded JSON file ka path yahan do
const serviceAccount = require("./agent-assessment-656aaeb8566f.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Test Function: Check karne ke liye ki connection kaam kar raha hai ya nahi
async function testConnection() {
    try {
        const docRef = db.collection('tasks').doc('test-task');
        await docRef.set({
            title: 'Hello Agent!',
            status: 'connected',
            timestamp: new Date()
        });
        console.log("🔥 Database Connected Successfully!");
    } catch (error) {
        console.error("❌ Connection Error:", error);
    }
}

testConnection();

module.exports = db;