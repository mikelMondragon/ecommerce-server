const Product = require("../models/product.model")

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {

    try {
        const products = await Product.find();
        return res.status(200).json({
            ok: true,
            products
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error getting products"
        });
    }
}


module.exports = {
    getAllProducts
}