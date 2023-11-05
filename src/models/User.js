//é necessário criar um schema pra limitar como os documentos serão criados

import mongoose from "mongoose";
import bcrypt from "bcryptjs"

//criou uma nova instancia do schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // obrigatorio
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, //email unico
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // o password não é retornado
    },
    avatar: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: true,
    }
})

// criptografia da senha
UserSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 10) //10 rodadas de criptografia
    next()
})
const User = mongoose.model("User", UserSchema); //definiu a model

export default User;
