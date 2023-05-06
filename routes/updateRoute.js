import Express from "express"
import {  updateDetails } from "../controllers/updateController.js"

const router  = Express.Router()

router.post("/update-details",updateDetails)

export default router