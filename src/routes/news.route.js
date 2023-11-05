import { Router } from "express"
const router = Router();

import newsController from "../controllers/news.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validNews } from "../middlewares/global.middlewares.js";

router.post("/", authMiddleware, newsController.create);
router.get("/", newsController.findAll)
router.get("/top", newsController.topNews)
router.get("/search", newsController.searchByTitle)
router.get("/byUser", authMiddleware, newsController.byUser)
router.get("/:id", authMiddleware, newsController.findById)
router.patch("/:id", authMiddleware, validNews, newsController.update)
router.delete("/:id", authMiddleware, validNews, newsController.erase)
router.patch("/like/:id", authMiddleware, validNews, newsController.likeNews)
router.patch("/comment/:id", authMiddleware, newsController.addComment)
router.delete("/comment/:idNews/:idComment", authMiddleware, newsController.deleteComment)
export default router;