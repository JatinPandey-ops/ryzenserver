import Express from "express"
import { result } from "../controllers/chatController.js"
const router = Express.Router()

router.get("/",result)
export default router