import bcrypt from "bcryptjs"
import { loginService, generateToken } from "../services/auth.service.js"

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // o .select('+password') traz a senha
        const user = await loginService(email).select('+password');
        if (!user) {
            return res.status(404).send({ message: "User or Password not found" })

        }

        const passwordIsValid = await bcrypt.compare(password, user.password)
        if (!passwordIsValid) {
            return res.status(404).send({ message: "User or Password not found" })
        }

        const token = generateToken(user.id)

        res.send({ token })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export default { login }