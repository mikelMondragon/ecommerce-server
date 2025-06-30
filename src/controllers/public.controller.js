const Product = require('../models/product.model');

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    console.log("brrrrrrrrrrr")
    try {
        const products = await Product.find();
        res.status(200).json({
            ok: true,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error getting products"
        });
    }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({
            ok: false,
            msg: "Product not found"
        });
        res.status(200).json({
            ok: true,
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error getting product"
        });
    }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const { body } = req;
        const existingProduct = await Product.findOne({ name: body.name });
        if (existingProduct) {
            return res.status(409).json({
                ok: false,
                msg: "Product already exist"
            })
        }
        const newProduct = new Product(body);
        await newProduct.save();
        res.status(201).json({
            ok: true,
            product: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error creating product"
        });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({
            ok: false,
            msg: "Product not found"
        });
        res.status(200).json({
            ok: true,
            product: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error updating product"
        });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({
            ok: false,
            msg: "Product not found"
        });
        res.status(200).json({
            ok: true,
            msg: "Product deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error deleting product"
        });
    }
};

const getProductsByCategoryAndTags = async (req, res) => {
    try {
        const category = req.query.category || req.params.category || "";
        let tags = req.query.tags || req.body.tags;

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: "Tags array is required"
            });
        }

        // Construir filtro dinámico
        const filter = {
            tags: { $all: tags }
        };

        // Solo agregar filtro categoría si category NO está vacía
        if (category.trim() !== "") {
            filter.category = category;
        }

        const products = await Product.find(filter);

        res.status(200).json({
            ok: true,
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error fetching products by category and tags"
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
