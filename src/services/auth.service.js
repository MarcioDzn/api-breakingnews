import User from "../models/User.js"
import jwt from "jsonwebtoken"

const loginService = (email) => User.findOne({ email: email })

// gera um token a partir do ID, com uma chave md5 e a config de expiração (tempo - 24 horas)
const generateToken = (id) => jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 })

export { loginService, generateToken }