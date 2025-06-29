const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { publicRoutes } = require("./routes/index.routes")
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
const frontUrl = process.env.FRONT_URL || "http://localhost:3000"
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
app.use("/api/v1", publicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server run on port: ${PORT}`)
})
