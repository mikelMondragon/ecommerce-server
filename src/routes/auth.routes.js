const { Router } = require("express");
const { check, param } = require('express-validator');
const { validateInput } = require("../middlewares/validateInput.middleware")
const { validateFirebaseToken } = require("../middlewares/validateFirebaseToken.middleware")


const { register, login, user } = require('../controllers/auth.controller');
const router = new Router();

//LOGIN
router.post("/login", [
    check("email", "invalid email").notEmpty()
        .withMessage('El email no puede estar vacío')
        .isEmail()
        .withMessage('El formato del email no es correcto')
        .isLength({ min: 3, max: 100 })
        .withMessage('Debe tener entre 3 y 100 caracteres'),
    check("password", "invalid password").isStrongPassword(),
    validateInput
], login)

//REGISTRY
http://localhost:5000/auth/register
router.post("/register", [
    validateFirebaseToken,
    validateInput
], register)

router.post("/user", [
    validateFirebaseToken,
], user)


module.exports = router;