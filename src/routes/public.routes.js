const { Router } = require("express");
const { check } = require('express-validator');
const { validateInput } = require("../middlewares/validateInput.middleware")
const upload = require("../middlewares/upload.middleware")

const { getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct } = require('../controllers/public.controller');
const router = new Router();

//GET: http://localhost:5000/api/v1/products
router.get('/', getAllProducts);//productos?category=&color=negro&precioMax=100

//GET: http://localhost:5000/api/v1/products/:id
router.get('/:id', getProductById);

//POST: http://localhost:5000/api/v1/products
router.post('/', [
    upload.any(),
    check("name", "empty name").notEmpty()
        .isString()
        .withMessage("name must be a string")
        .isLength({ min: 2, max: 50 })
        .withMessage("The name should have a length between 2 and 50"),
    check("category", "no category").notEmpty()
        .isString()
        .withMessage("category must be a string"),
    check("description", "description empty").notEmpty()
        .isString()
        .withMessage("description must be a string"),
    check("price", "price is required").notEmpty()
        .isFloat({ min: 0 })
        .withMessage("price must be a numeric value and min 0"),
    check("stock", "stock should have a value").notEmpty()
        .isInt({ min: 0 })
        .withMessage("stock must be a numeric value and min 0"),
    validateInput
], createProduct);


//PUT: http://localhost:5000/api/v1/products/:id
router.put('/:id', [
    upload.any()
], updateProduct);

//DELETE: http://localhost:5000/api/v1/products/:id
router.delete('/:id', deleteProduct);

module.exports = router;
