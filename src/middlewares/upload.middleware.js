const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (file.fieldname === "images") {
            cb(null, "uploads/images");
        } else if (file.fieldname.startsWith("models[")) {
            cb(null, "uploads/models");
        } else {
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
        if ([".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes en el campo images"));
        }
    } else if (file.fieldname.startsWith("models[")) {
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
    // limits: { fileSize: 100 * 1024 * 1024 }, // Ejemplo: límite 50MB para modelos
});

module.exports = upload;
