const { Router } = require("express");
const { check, param } = require('express-validator');
const { validateInput } = require("../middlewares/validateInput.middleware")
const upload = require("../middlewares/upload.middleware")

const { getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct } = require('../controllers/public.controller');
const { validateJWT } = require("../middlewares/validateJWT.middleware");
const { validateRole } = require("../middlewares/validateRole.middleware");
const router = new Router();

//GET: http://localhost:5000/api/v1/products
router.get('/', getAllProducts);//productos?category=&color=negro&precioMax=100

//GET: http://localhost:5000/api/v1/products/:id
router.get('/:id', [
    param("id", "need valid id").isMongoId()
], getProductById);

//POST: http://localhost:5000/api/v1/products
router.post('/', [
    validateJWT,
    validateRole("admin"),
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
    upload.any(),
    // param("id", "need valid id").isMongoId(),
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
], updateProduct);

//DELETE: http://localhost:5000/api/v1/products/:id
router.delete('/:id', [
    param("id", "need valid id").isMongoId()
], deleteProduct);

module.exports = router;
