import authController from "../controllers/auth.controller.js"
import { Router } from "express"
const router = Router()

router.post("/", authController.login)

export default router;