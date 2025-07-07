const Product = require('../models/product.model');
const fs = require('fs/promises'); //To delete files

// GET ALL PRODUCTS
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
const getAllProducts = async (req, res) => {
    try {
        const { name, category, tags, minPrice, maxPrice, inStock, page = 1, limit = 10 } = req.query;
        const query = {};

        // Dynamic filters
        // Name
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // búsqueda insensible a mayúsculas
        }

        // Category
        if (category) {
            query.category = category;
        }

        // Tags (array[String])
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(',');
            query.tags = { $all: tagArray };
        }

        // Price
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Stock
        if (inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            ok: true,
            products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Server error' });
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
    const { id, name, category, description, price, stock, existingImages, existingModels } = req.body;
    // const id = req.params.id;
    const files = req.files || [];
    console.log(JSON.parse(existingModels));
    // Clasificar archivos
    const images = existingImages.split(",");
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
    console.log(models)
    models.push(...JSON.parse(existingModels));


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


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
