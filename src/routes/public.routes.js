const { Router } = require("express");
const { check } = require('express-validator');
const { validateInput } = require("../middlewares/validateInput.middleware")

const { getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct } = require('../controllers/public.controller');
const router = new Router();

//GET: http://localhost:5000/api/v1/products
router.get('/', getAllProducts);

//GET: http://localhost:5000/api/v1/products/:id
router.get('/:id', getProductById);

//POST: http://localhost:5000/api/v1/products
router.post('/', createProduct);

//PUT: http://localhost:5000/api/v1/products/:id
router.put('/:id', updateProduct);

//DELETE: http://localhost:5000/api/v1/products/:id
router.delete('/:id', deleteProduct);
module.exports = router;
