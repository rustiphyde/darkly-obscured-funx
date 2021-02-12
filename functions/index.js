const functions = require('firebase-functions');

const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { db, admin } = require("./util/admin");

const {
    authenticateIPW,
    signupInvestigator,
    loginInvestigator,
    resetInvestigatorPassword
} = require("./handlers/investigators");

// User Routes
app.post("/investigator-signup", signupInvestigator);
app.post("/investigator-login", loginInvestigator);
app.post("/investigators-password", authenticateIPW);
app.post("investigator-reset", resetInvestigatorPassword);

exports.api = functions.https.onRequest(app);
