import Express from "express"
import { handleEvent, subscribe, createCustomer, verifyPayemnt } from "../controllers/PAymentController.js"


const router = Express.Router();

// router.post("/create-checkout-session" , handlePayment)
router.post("/event" , handleEvent)
router.post("/verify-payment" , verifyPayemnt)
router.post("/subscribe" , subscribe)
router.post("/create-customer" , createCustomer)
export default router