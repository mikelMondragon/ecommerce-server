const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
const frontUrl = process.env.FRONT_URL || "http://localhost:3000"
const whiteList = [frontUrl]

app.use(cors({
    origin: whiteList
}))
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl}`);
    next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server run on port: ${port}`)
})
