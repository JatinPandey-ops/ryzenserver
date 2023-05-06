import Express from "express"
import { forgetPassword, login, register } from "../controllers/authController.js";


const router = Express.Router();

router.post("/login",login)
router.post("/register",register)
router.post("/reset-password",forgetPassword)

export default router