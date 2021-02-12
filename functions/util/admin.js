const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mostlyghostly-21021.firebaseio.com",
  storageBucket: "mostlyghostly-21021.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };