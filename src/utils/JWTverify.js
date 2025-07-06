var jwt = require('jsonwebtoken');

const verifyJWT = async (token) => {
    try {
        const privateKey = process.env.PRIVATE_KEY_JWB;
        const decoded = jwt.verify(token, privateKey);
        return decoded;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    verifyJWT
}