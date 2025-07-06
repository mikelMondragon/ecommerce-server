const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    _id: {
        type: String
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    // password: {
    //     type: String,
    //     required: true
    // }

})

module.exports = model("users", UserSchema);