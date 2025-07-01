const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { publicRoutes } = require("./routes/index.routes")
require('dotenv').config();
const { connection } = require("./config/DBconnect")
const app = express();


connection()
    .catch((error) => {
        console.log(error);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
const frontUrl = process.env.FRONT_URL || "http://localhost:5173"
const whiteList = [frontUrl]

app.use(cors({
    origin: whiteList
}))
//Debug msg
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl}`);
    next();
});
//Routes
app.use("/api/v1/products", publicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server run on port: ${PORT}`)
})
