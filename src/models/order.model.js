const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
    total: Number,
    currency: {
        type: String,
        default: 'eur'
    },
    stripeSessionId: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Order', orderSchema);
