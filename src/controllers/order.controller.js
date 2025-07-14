require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.PRIVATE_KEY_STRIPE);
const Order = require("../models/order.model");
const { default: mongoose } = require('mongoose');

const createCheckoutSession = async (req, res) => {
    try {
        const products = req.body;

        const line_items = products.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    metadata: {
                        productId: item._id
                    }
                    // También puedes pasar description o images
                },
                unit_amount: Math.round(item.price * 100), // en centimos
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${process.env.FRONT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONT_URL}/cancel`,
            metadata: {
                userId: req.uid || "SA2AbF4NIog1jgAx24j1yNDBnyz2",
                products: JSON.stringify(products.map(p => ({
                    productId: p._id,
                    name: p.name,
                    price: p.price,
                    quantity: p.quantity
                })))
            },
            shipping_address_collection: {
                allowed_countries: ['ES', 'FR', 'IT']
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe session error:', error.message);
        res.status(500).json({ error: 'Error creating checkout session' });
    }
}

const webHook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.PRIVATE_KEY_WEBHOOK;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    if (event.type === 'checkout.session.completed') {
        const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
            expand: ['shipping']
        });

        // Ejemplo: guardamos la orden
        const metadata = session.metadata; // info que podrías haber pasado tú
        let parsedProducts;
        try {
            parsedProducts = JSON.parse(metadata.products);
        } catch (err) {
            console.error('Failed to parse products from metadata:', err.message);
            parsedProducts = [];
        }
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // Aca podés mapear eso a tu modelo de Order
        const newOrder = new Order({
            user: metadata?.userId || "SA2AbF4NIog1jgAx24j1yNDBnyz2", // si lo pasaste antes
            stripeSessionId: session.id,
            paymentStatus: 'paid',
            currency: session.currency,
            total: session.amount_total / 100,
            products: parsedProducts.map(item => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress: session.customer_details.address
        });

        await newOrder.save();
        console.log('✅ Order saved:', newOrder._id);
    }

    res.json({ received: true });
}

const getOrderBySession = async (req, res) => {
    const { sessionId } = req.params
    const order = await Order.findOne({ stripeSessionId: sessionId, paymentStatus: 'paid' })

    if (!order) return res.status(404).json({ message: 'Order not found' })

    res.json(order)
}


const getOrdersByUserId = async (req, res) => {
    console.log(req.uid);
    try {
        const orders = await Order.find({ user: req.uid });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ ok: false, message: 'No orders found' });
        }
        res.status(200).json({ ok: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, error: error.message });
    }
}


// EXPORTS 
module.exports = {
    createCheckoutSession,
    webHook,
    getOrderBySession,
    getOrdersByUserId
}