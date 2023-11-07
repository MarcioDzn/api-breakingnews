import {
    createService,
    findAllService,
    countNews,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    updateService,
    eraseService,
    likeNewsService,
    deleteLikeNewsService,
    addCommentService,
    deleteCommentService,
} from "../services/news.service.js"

const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title || !text || !banner) {
            res.status(400).send(
                { message: "Submit all fields for registration" }
            )
        }

        await createService({
            title,
            text,
            banner,
            user: req.userId
        })

        res.send(201)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const findAll = async (req, res) => {
    try {
        /////// PAGINAÇÃO DE DADOS /////////
        // recebe os query parameters
        let { limit, offset } = req.query;
        limit = Number(limit)
        offset = Number(offset)

        if (!limit) {
            limit = 5;
        }

        if (!offset) {
            offset = 0;
        }

        // as alterações de limit e offset serão feitas no front end
        const news = await findAllService(offset, limit)
        const total = await countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl =
            next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl =
            previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map((newsItem) => ({
                id: newsItem._id,
                title: newsItem.title,
                test: newsItem.text,
                banner: newsItem.banner,
                likes: newsItem.likes,
                comments: newsItem.comments,
                name: newsItem.user.name,
                username: newsItem.user.username,
                userAvatar: newsItem.user.avatar
            }))
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(400).send({ message: "There are no news!" })
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                test: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const findById = async (req, res) => {
    try {
        const { id } = req.params
        const news = await findByIdService(id);

        if (!news) {
            res.status(400).send({ message: "News not found!" })
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                test: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }


}

const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query; // recebe o titulo por queryString

        const news = await searchByTitleService(title);

        res.send({
            results: news.map((newsItem) => ({
                id: newsItem._id,
                title: newsItem.title,
                test: newsItem.text,
                banner: newsItem.banner,
                likes: newsItem.likes,
                comments: newsItem.comments,
                name: newsItem.user.name,
                username: newsItem.user.username,
                userAvatar: newsItem.user.avatar
            }))
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const byUser = async (req, res) => {
    try {
        const id = req.userId;

        const news = await byUserService(id)

        res.send({
            results: news.map((newsItem) => ({
                id: newsItem._id,
                title: newsItem.title,
                test: newsItem.text,
                banner: newsItem.banner,
                likes: newsItem.likes,
                comments: newsItem.comments,
                name: newsItem.user.name,
                username: newsItem.user.username,
                userAvatar: newsItem.user.avatar
            }))
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params

        const { title, text, banner } = req.body

        if (!title && !banner && !text) {
            res.status(400).send({
                message: "Submit at least one field to update the post",
            })
        }

        // garantindo que quem criou a news seja a mesma
        // pessa que ta tentando atualiza-la
        const news = await findByIdService(id)

        // verifica se o id do usuario da postagem a ser atualizada
        // é igual ao usuário q ta logado/autenticado
        if (String(news.user._id) !== String(req.userId)) {
            return res.status(400).send({
                message: "You didn't create this post"
            })
        }

        await updateService(id, title, text, banner);

        return res.send({ message: "Post sucessfully updated!" })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const erase = async (req, res) => {
    try {
        const { id } = req.params

        const news = await findByIdService(id)

        if (String(news.user._id) !== String(req.userId)) {
            return res.status(400).send({
                message: "You didn't created this post"
            })
        }

        await eraseService(id)

        return res.send({ message: "Post deleted sucessfully" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const newsLiked = await likeNewsService(id, userId);

        // tirar o like caso aperte denovo e ja tenha likado
        if (!newsLiked) {
            await deleteLikeNewsService(id, userId)
            return res.status(200).send({ message: "Like successfully removed!" })
        }

        res.send({ message: "Like done successfully!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).send({ message: "Write a message to comment" });
        }

        await addCommentService(id, comment, userId);

        res.send({ message: "Comment successfully completed!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { idNews, idComment } = req.params;
        const userId = req.userId;
        
        const commentDeleted = await deleteCommentService(idNews, idComment, userId);

        const commentFinder = commentDeleted.comments.find(
            comment => comment.idComment === idComment)
        
        if (!commentFinder) {
            return res.status(400).send({message: "Comment not found"})
        }

        if (String(userId) != String(commentFinder.userId)){
            return res.status(400).send({message: "You can't delete this comment"})
        }

        res.send({ message: "Comment successfully removed!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export default {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    byUser,
    update,
    erase,
    likeNews,
    addComment,
    deleteComment,
}