import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js"

dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        // garante que só um usuário logado possa fazer postagens
        const { authorization } = req.headers;
        if (!authorization) {
            // 401 código responsável pela autorização
            return res.sendStatus(401);
        }

        const parts = authorization.split(" ")

        if (parts.length != 2) {
            return res.sendStatus(401);
        }

        const [schema, token] = parts

        if (schema !== "Bearer") {
            return res.sendStatus(401);
        }

        // validando o token
        jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
            if (error) {
                return res.send(401).send({message: "Token invalid!"})
            }

            // verifica se o usuário existe
            const user = await userService.findByIdService(decoded.id)

            if (!user || !user.id) {
                res.status(401).send({ message: "Invalid id!" })
            }

            // pega o id do usuário e passa na requisição
            req.userId = user._id

            return next();
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}