const { Router } = require("express");
const { check } = require('express-validator');
const { validateInput } = require("../middlewares/validateInput.middleware")

const {
    getAllProducts
} = require("../controllers/public.controller");

const router = new Router();
//GET: http://localhost:3000/api/v1/productos
router.get("/products", getAllProducts);
module.exports = router;