const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { publicRoutes, authRoutes } = require("./routes")
require('dotenv').config();
const { connection } = require("./config/DBconnect")
const cookieParser = require('cookie-parser');

const app = express();

//Init db
connection()
    .catch((error) => {
        console.log(error);
    })


app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads/models', (req, res, next) => {
    if (req.url.endsWith('.glb')) {
        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Access-Control-Allow-Origin', '*'); // CORS explícito por si acaso
    }
    next();
});

// Hacer pública la carpeta "uploads"
app.use("/uploads", express.static("uploads"));


// Middlewares
const frontUrl = process.env.FRONT_URL || "http://localhost:5173"
const whiteList = [frontUrl]

app.use(cors({
    origin: frontUrl,
    credentials: true,
}))

//Debug msg
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl}`);
    next();
});
//Routes
app.use("/api/v1/products", publicRoutes);
app.use("/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server run on port: ${PORT}`)
})
