const mongoose = require('mongoose');

const connection = async () => {
    const uri = process.env.URI;
    try {
        const newConnection = await mongoose.connect(uri)
        console.log("DDBB connected")
    } catch (error) {
        throw {
            ok: false,
            msg: "Error in the connection with de DDBB"
        }
    }

}

module.exports = {
    connection
}
