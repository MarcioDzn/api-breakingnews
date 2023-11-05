import mongoose from "mongoose";
import userService from "../services/user.service.js";
import { findByIdService } from "../services/news.service.js"

export const validId = (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({ message: "Invalid ID" })
        }

        // garante que a próxima função, no caso o controller, seja executada
        next();
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const validUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await userService.findByIdService(id)

        if (!user) {
            res.status(400).send({ message: "User not found!" })
        }

        req.id = id;
        req.user = user;

        // garante que a próxima função, no caso o controller, seja executada
        next();
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const validNews = async (req, res, next) => {
    try {
        const { id } = req.params

        const news = await findByIdService(id)

        if (!news) {
            res.status(400).send({message: "News not found!"})
        }

        next();
    } catch (error) {
        res.status(500).send({ message: err.message })
    }
}

