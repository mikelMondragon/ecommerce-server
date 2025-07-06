// decodeIdToken.js
const admin = require("../config/firebase.config");

const validateFirebaseToken = async (req, res, next) => {
    const { idToken } = req.body;
    console.log("validateFirebaseToken")
    if (!idToken) {
        return res.status(401).json({ msg: "Firebase token needed" });
    }

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        req.firebaseUser = decoded;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ msg: "Invalid token" });
    }
};
module.exports = {
    validateFirebaseToken
}