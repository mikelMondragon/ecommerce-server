const { Router } = require("express");
const { check, param } = require('express-validator');
const { validateInput } = require("../middlewares/validateInput.middleware")
const { validateFirebaseToken } = require("../middlewares/validateFirebaseToken.middleware")


const { register, login, user, logout } = require('../controllers/auth.controller');
const router = new Router();

//LOGIN
router.post("/login", [
    validateFirebaseToken
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

router.get("/logout", [
], logout)


module.exports = router;