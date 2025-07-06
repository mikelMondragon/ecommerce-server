var jwt = require('jsonwebtoken');

const generateJWT = async ({ uid, email, role }) => {
    try {
        const privateKey = process.env.PRIVATE_KEY_JWB;
        const playLoad = { uid, email, role };
        var token = jwt.sign(playLoad, privateKey, { expiresIn: "2h" })
        return token;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    generateJWT
}