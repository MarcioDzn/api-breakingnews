import userService from "../services/user.service.js"
import mongoose from "mongoose"

const create = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body

        if (!name || !username || !email || !password || !avatar || !background) {
            res.status(400).send({ message: "Submit all fields for registration" })
        }

        const user = await userService.createService(req.body)

        if (!user) {
            return res.status(400).send({ message: "Error creating user" })
        }

        res.status(201).send({
            message: "User created successfully",
            user: {
                id: user._id,
                name,
                username,
                email,
                avatar,
                background
            }
        })
    } catch (err) {
        // 500 - erro de servidor
        res.status(500).send({ message: err.message })
    }
}

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService()

        res.send(users)
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const findById = async (req, res) => {
    // const id = req.params.id // pega o valor no parametro do id (o.id foi definido por nós, mas poderia ser .nome)
    // const id = req.id
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).send({ message: "Invalid id" })
    // }

    try {    
        // const user = await userService.findByIdService(id)
        const user = req.user

        // if (!user) {
        //     return res.status(400).send({ message: "User not found" })
        // }

        res.send(user)
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const update = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body

        if (!name && !username && !email && !password && !avatar && !background) {
            res.status(400).send({ message: "Submit at least one field for registration" })
        }

        const id = req.id

        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).send({ message: "Invalid id" })
        // }

        // const user = await userService.findByIdService(id)

        // if (!user) {
        //     return res.status(400).send({ message: "User not found" })
        // }

        await userService.updateService(
            id,
            name,
            username,
            email,
            password,
            avatar,
            background
        )

        res.send({ message: "User sucessfully updated!" })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

export default { create, findAll, findById, update }