// import express from "express";
import { Router } from "express"
import userController from "../controllers/user.controller.js"
import { validId, validUser } from "../middlewares/global.middlewares.js"

// const router = express.Router()
const router = Router()

// Estrutura: 
// rota
// middleware
// controller
router.post('/', userController.create)
router.get('/', userController.findAll)
router.get('/:id', validId, validUser, userController.findById) // o ':' é o parametro e o id é o nome do parametro
router.patch('/:id', validUser, validUser, userController.update)

export default router;