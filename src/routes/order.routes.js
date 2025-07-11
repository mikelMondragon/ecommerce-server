const { Router } = require("express");
const {
    createCheckoutSession,
    webHook,
    getOrderBySession
} = require("../controllers/order.controller");
const { validateJWT } = require("../middlewares/validateJWT.middleware");

const router = new Router();

router.post("/createCheckoutSession", [
    validateJWT
], createCheckoutSession);

router.post("/webhook", webHook);

router.get("/session/:sessionId", getOrderBySession);


module.exports = router;