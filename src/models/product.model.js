const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Miniatures", "Paints", "Tools"]
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    models: {
        type: [String],
        default: []
    }
})
// TODO: in the furute if I have time I can set the price depending the piece.
//  parts: [
//     {
//       type: { type: String, required: true }, 
//       variants: [
//         {
//           model: { type: String, required: true },
//           materialOptions: [
//             {
//               material: { type: String, required: true },
//               weight: { type: Number, required: true },
//               pricePerGram: { type: Number, required: true }
//             }
//           ]
//         }
//       ]
//     }
//   ]
module.exports = model("products", ProductSchema);