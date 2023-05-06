import Express from "express"
import { result, snapshot} from "../controllers/chatController.js"
const router = Express.Router()

router.post("/",result)
router.get("/data",snapshot)
export default router