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
    upload.fields([
        { name: "images", maxCount: 5 },
        { name: "models", maxCount: 5 },
    ])
], createProduct);

//PUT: http://localhost:5000/api/v1/products/:id
router.put('/:id', updateProduct);

//DELETE: http://localhost:5000/api/v1/products/:id
router.delete('/:id', deleteProduct);

module.exports = router;
