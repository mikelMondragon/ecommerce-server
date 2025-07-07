/**
 * Sets the JWT cookie with secure defaults.
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to send
 */
function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 día
    });
}

module.exports = setAuthCookie;
