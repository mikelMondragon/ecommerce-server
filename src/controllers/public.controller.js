const Product = require('../models/product.model');
const fs = require('fs/promises'); //To delete files

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
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
    let uploadedFilePaths = [];

    try {
        const { name, category, description, price, stock } = req.body;
        const files = req.files || [];

        // Clasificar archivos
        const images = [];
        const modelSlots = {};

        for (const file of files) {
            uploadedFilePaths.push(file.path); // para limpieza si algo falla

            if (file.fieldname === "images") {
                images.push(file.path);
            }

            const match = file.fieldname.match(/^models\[(.+)\]$/);
            if (match) {
                const slot = match[1];
                if (!modelSlots[slot]) {
                    modelSlots[slot] = [];
                }
                modelSlots[slot].push(file.path);
            }
        }

        // Formatear modelos
        const models = Object.entries(modelSlots).map(([slot, files]) => ({
            slot,
            files
        }));

        // Verificar duplicado
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            for (const path of uploadedFilePaths) {
                await fs.unlink(path);
            }
            return res.status(409).json({
                ok: false,
                msg: "Product already exists"
            });
        }

        // Crear nuevo producto
        const newProduct = new Product({
            name,
            category,
            description,
            price,
            stock,
            images,
            models
        });

        await newProduct.save();

        res.status(201).json({
            ok: true,
            product: newProduct
        });

    } catch (error) {
        for (const path of uploadedFilePaths) {
            await fs.unlink(path);
        }
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error creating product"
        });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    let uploadedFilePaths = [];
    //crear un objeto y poner la id desde params
    //images: comprobar si se han cambiado, si es el caso eliminar los anteriores
    //modelos: **
    console.log(req.body)
    const { id, name, category, description, price, stock } = req.body;
    // const id = req.params.id;
    const files = req.files || [];

    // Clasificar archivos
    const images = [];
    const modelSlots = {};

    for (const file of files) {
        uploadedFilePaths.push(file.path); // para limpieza si algo falla

        if (file.fieldname === "images") {
            images.push(file.path);
        }

        const match = file.fieldname.match(/^models\[(.+)\]$/);
        if (match) {
            const slot = match[1];
            if (!modelSlots[slot]) {
                modelSlots[slot] = [];
            }
            modelSlots[slot].push(file.path);
        }
    }
    // Formatear modelos
    const models = Object.entries(modelSlots).map(([slot, files]) => ({
        slot,
        files
    }));
    console.log({ models })
    const editedProduct = new Product({
        _id: id,
        name,
        category,
        description,
        price,
        stock,
        images,
        models
    });


    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, editedProduct, { new: true });
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
            msg: error
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


//pastillitas por tags?
//el buscador busca tanto en categorias como en tags?

// TODO IMPORTANTE: tema paginacion, tambien deberia de verlo en get all, podria unificarlo con esto?
// Deberia de obtener mas de un parametro y dependiendo obtener?
// nombre: si esta vacio no añadir el filtro de nombre
// categoria: si esta vacio no añadir el filtro de categorias
// tags: si esta vacio no añadir el filtro de tags sino contener TODOS los tags indicados o SOLO 1? me tira mas TOODOS
// precio: minimo maximo, solamente usarlo si tiene el parametro
// stock: disponibilidad, solo mostrar productos con stock 0 o mas
// rating? mucha flipada
const getProductsByCategoryAndTags = async (req, res) => {

};
// try {
//     const category = req.query.category || req.params.category || "";
//     let tags = req.query.tags || req.body.tags;

//     if (!tags || !Array.isArray(tags) || tags.length === 0) {
//         return res.status(400).json({
//             ok: false,
//             msg: "Tags array is required"
//         });
//     }


//     const filter = {
//         tags: { $all: tags }
//     };


//     if (category !== "") {
//         filter.category = category;
//     }

//     const products = await Product.find(filter);

//     res.status(200).json({
//         ok: true,
//         products
//     });
// } catch (error) {
//     console.error(error);
//     res.status(500).json({
//         ok: false,
//         msg: "Error fetching products by category and tags"
//     });
// }
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
