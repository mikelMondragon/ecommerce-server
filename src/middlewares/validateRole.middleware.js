/**
 * Middleware que valida los roles de usuario contra el rol permitido.
 * Crea un middleware personalizado para verificar si el rol del usuario está autorizado.
 * @param {...String} roles - Rol permitido (rol permitido "Admin").
 * @returns {Function} Middleware de Express configurado para validar los roles especificados.
 * 
 * Middleware que verifica si el rol del usuario está autorizado
    * @param {Object} req - Objeto de solicitud de Express (debe contener req.role)
    * @param {Object} res - Objeto de respuesta de Express
    * @param {Function} next - Función para continuar al siguiente middleware
*/
const validateRole = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.role)) {
            next();
        } else {
            return res.status(404).json({
                ok: false,
                msg: "incorrect roles"
            });
        }
    }
}

module.exports = { validateRole };