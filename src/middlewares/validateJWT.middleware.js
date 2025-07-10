const { verifyJWT } = require("../utils/JWTverify")
const { generateJWT } = require("../utils/JWTgenerate");
const setAuthCookie = require("../utils/setAuthCookies");

/**
 * Middleware para validar tokens JWT en las solicitudes HTTP.
 * Verifica la presencia y validez del token en el header 'Authorization'.
 * Si es válido, adjunta el email y rol del usuario al objeto 'req' para su uso posterior.
 * Si no es válido, devuelve una respuesta de error.
 * @param {*} req Objeto de solicitud.
 * @param {*} res Objeto de respuesta.
 * @param {*} next Función para pasar al siguiente middleware.
 * @returns {Object|void} Retorna una respuesta JSON con errores o pasa al siguiente middleware.
 */
const validateJWT = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "Missing auth token in cookies"
        });
    }
    try {
        const playLoad = await verifyJWT(token);
        const renewedToken = await generateJWT({
            uid: playLoad.uid,
            email: playLoad.email,
            role: playLoad.role
        });
        req.tokenEmail = playLoad.email;
        req.role = playLoad.role;
        req.uid = playLoad.uid;
        setAuthCookie(res, renewedToken);
        next();
    } catch (error) {
        console.error("JWT validation error:", error);
        return res.status(401).json({
            ok: false,
            msg: error
        });
    }
}


module.exports = { validateJWT }