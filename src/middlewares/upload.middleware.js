const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (file.fieldname === "images") {
            // Carpeta para imágenes
            cb(null, "uploads/images");
        } else if (file.fieldname === "models") {
            // Carpeta para modelos 3D
            cb(null, "uploads/models");
        } else {
            // Carpeta por defecto o error
            //TODO: considerar dar error
            cb(null, "uploads/others");
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === "images") {
        // Solo imágenes
        if ([".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes en el campo images"));
        }
    } else if (file.fieldname === "models") {
        // Solo modelos 3D (.glb, .gltf)
        if ([".glb", ".gltf"].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten modelos 3D en el campo models"));
        }
    } else {
        cb(new Error("Campo no válido para archivo"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // Ejemplo: límite 20MB para modelos
});

module.exports = upload;
