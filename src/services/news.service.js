import News from "../models/News.js"

export const createService = (body) => News.create(body)

// o populate pega as informações do usuario "user"
export const findAllService = (offset, limit) =>
    News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

export const countNews = () => News.countDocuments();

//o sort faz a lista vir invertida e o findOne sem nenhum 
// parametro retorna o primeiro item da lista
export const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => News.findById(id).populate("user")

// fazendo regex direto aqui pra aumentar a velocidade da busca
// o $ é pra realizar um comando especifico do mongoDB
// o $options: "i" é pra case insensitive (não importa o caps lock)
export const searchByTitleService = (title) =>
    News.find({
        title: { $regex: `${title || ""}`, $options: "i" }
    })
        .sort({ _id: -1 })
        .populate("user")

export const byUserService = (id) =>
    News.find({ user: id }).sort({ _id: -1 }).populate("user")

export const updateService = (id, title, text, banner) =>
    News.findOneAndUpdate(
        { _id: id },
        { title, text, banner },
        {
            includeResultMetadata: true,
        }
    )

export const eraseService = (id) => News.findOneAndDelete({ _id: id })

// dá um push no campo likes com a informação de likes
// "likes.userId": {$nin: {userId}} garante que só
// dê like uma vez
export const likeNewsService = (idNews, userId) =>
    News.findOneAndUpdate(
        { _id: idNews, "likes.userId": { $nin: [userId] } },
        { $push: { likes: { userId, created: new Date() } } }
    )


// o pull vai remover o like do userId
export const deleteLikeNewsService = (idNews, userId) =>
    News.findOneAndUpdate(
        { _id: idNews },
        { $pull: { likes: { userId } } }
    )

export const addCommentService = (idNews, comment, userId) => {
    // é necessário criar um id pra cada comentário
    // 36 caracteres criados com js puro
    const idComment = Math.floor(Date.now() * Math.random()).toString(36)

    return News.findOneAndUpdate(
        { _id: idNews },
        { $push: { 
            comments: { idComment, userId, comment, 
            createdAt: new Date() } } }
    );
}

export const deleteCommentService = (idNews, idComment, userId) => 
    News.findOneAndUpdate(
        {_id: idNews},
        {$pull: {comments: {idComment, userId}}}
        )
