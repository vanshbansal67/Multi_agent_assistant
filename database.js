const admin = require("firebase-admin");

// Agar environment variable mil jaye toh use parse karo, warna local file (development ke liye)
let serviceAccount;
if (process.env.SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
} else {
    serviceAccount = require("./agent-assessment-656aaeb8566f.json");
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
module.exports = db;