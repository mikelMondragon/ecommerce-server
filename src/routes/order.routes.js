const { Router } = require("express");
const {
    createCheckoutSession,
    webHook
} = require("../controllers/order.controller")

const router = new Router();


router.post("/createCheckoutSession", createCheckoutSession)

router.post("/webHook", webHook);


module.exports = router;