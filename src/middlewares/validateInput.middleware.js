const { validationResult } = require('express-validator');

const validateInput = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(404).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    next();
}


module.exports = {
    validateInput
}