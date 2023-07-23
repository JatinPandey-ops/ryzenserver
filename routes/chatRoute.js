import Express from "express"
import { reset, result, snapshot} from "../controllers/chatController.js"
const router = Express.Router()

router.post("/",result)
router.get("/data",snapshot)
router.post("/reset",reset)
export default router