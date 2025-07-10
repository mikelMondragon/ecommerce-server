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
            success_url: `${process.env.FRONT_URL}/success`,
            cancel_url: `${process.env.FRONT_URL}/cancel`,
            metadata: {
                userId: req.uid || "SA2AbF4NIog1jgAx24j1yNDBnyz2",
            },
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
        const session = event.data.object;

        // Ejemplo: guardamos la orden
        const metadata = session.metadata; // info que podrías haber pasado tú
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // Aca podés mapear eso a tu modelo de Order
        const newOrder = new Order({
            user: metadata?.userId || "SA2AbF4NIog1jgAx24j1yNDBnyz2", // si lo pasaste antes
            stripeSessionId: session.id,
            paymentStatus: 'paid',
            currency: session.currency,
            total: session.amount_total / 100,
            products: lineItems.data.map(item => ({
                name: item.description,
                quantity: item.quantity,
                price: item.amount_total / 100,
            })),
        });

        await newOrder.save();
        console.log('✅ Order saved:', newOrder._id);
    }

    res.json({ received: true });
}



// EXPORTS 
module.exports = {
    createCheckoutSession,
    webHook
}