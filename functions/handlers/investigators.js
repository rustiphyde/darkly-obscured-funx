const { admin, db } = require("../util/admin");
const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
    validateInvestigatorSignupData,
    validateInvestigatorLoginData,
    reduceInvestigatorDetails,
    validateResetData,
    validateIPWData
} = require("../util/validators");
const { app } = require("firebase-functions");

exports.authenticateIPW = (req, res) => {
    const pw = {
        ipw: req.body.ipw
    };

    const { valid, errors } = validateIPWData(pw);

    if(!valid) return res.status(400).json(errors);

    db.doc('IPW/pw')
        .get()
        .then((doc) => {
            if(doc.data().valid !== pw.ipw){
                return res.status(400).json({ error: "That is not the correct password!"});
            }

            return res.status(200).json({ password: "password accepted"});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })
}

exports.signupInvestigator = (req, res) => {
    const newInvestigator = {
        first: req.body.first,
        last: req.body.last,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    const { valid, errors } = validateInvestigatorSignupData(newInvestigator);

    if(!valid) return res.status(400).json(errors);

    const noImg = "MG-No-Img-Pic.jpg";

    let token, userId;

    db.doc(`/Users/${newInvestigator.email}`)
    .get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ email: "This investigator is already registered" });
        } else {
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newInvestigator.email, newInvestigator.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken(true);
    })
    .then(idToken => {
        token = idToken;
        const invCredentials = {
            first: newInvestigator.first,
            last: newInvestigator.last,
            joined: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt-media`,
            userId,
            mgprs: true,
            admin: false
        };
        return db.doc(`/Users/${newInvestigator.email}`).set(invCredentials);
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if (err.code === "auth/email-already-in-use"){
            return res.status(400).json({ email: "Email is already in use." })
        } else {
            return res.status(500)
            .json({ general: "Something went wrong, please try again." })
        }
        });
}

exports.loginInvestigator = (req, res) => {
    const investigator = {
        email: req.body.email.toLowerCase(),
        password: req.body.password
    };

    const { valid, errors } = validateInvestigatorLoginData(investigator);

    if (!valid) return res.status(400).json(errors);

    firebase
    .auth()
    .signInWithEmailAndPassword(investigator.email, investigator.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

exports.getInvestigatorDetails = (req, res) => {
    let invData = {};
    db.doc(`/Users/${req.params.email}`)
    .get()
    .then(doc => {
        if (doc.exists) {
            invData.investigator = doc.data();
            return db
                .collection("Investigations")
                .where("email", "==", req.params.email)
                .orderBy("createdAt", "desc")
                .get();
        } else {
            return res.status(404).json({ error: "Investigator not found in datatbase" });
        }
    })
    .then(data => {
        invData.investigations = [];
        data.forEach(doc => {
            invData.investigations.push({
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                email: doc.data().email,
                commentCount: doc.data().commentCount,
                investId: doc.id,
                date: doc.data().date,
                location: doc.data().location,
                time: doc.data().time
            })
        })
    })
}

exports.resetInvestigatorPassword = (req, res) => {
    const resInv = {
        email: req.body.email.toLowerCase()
    };

    const { valid, errors } = validateResetData(resInv);

    if (!valid){
        return res.status(400).json(errors);
    } else {
        firebase
            .auth()
            .sendPasswordResetEmail(resInv.email)
            .then(() => {
                return res.status(201).json({
                    message: "Your password reset email has been sent to the email address you provided"
                });
            })
            .catch(err => {
                if (err.code === "auth/user-not-found") {
                    return res.status(404).json({
                        reset: "The email you entered doesn't match any in our database"
                    });
                } else {
                    return res.status(500).json({ error: err.code });
                }
            });
    }
};


