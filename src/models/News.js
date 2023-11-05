import mongoose from "mongoose"

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now() // pega a data atual e adiciona nesse campo
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // esse nome deve ser exatamente igual ao export do User em User.js
        required: true,
    },
    likes: {
        type: Array,
        required: true,
    },
    comments: {
        type: Array,
        required: true,
    },
})

const News = mongoose.model("News", NewsSchema);

export default News