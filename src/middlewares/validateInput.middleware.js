const { validationResult } = require('express-validator');

const validateInput = (req, res, next) => {
    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.status(404).json({
            ok: false,
            errores: errores.mapped()
        });
    }
    next();
}


module.exports = {
    validateInput
}