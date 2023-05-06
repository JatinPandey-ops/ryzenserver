import Express from "express"
import { handlePayment } from "../controllers/PAymentController.js"


const router = Express.Router();

router.post("/intents" , handlePayment)
export default router