import { Router } from "express";
import postController from "../controllers/postController.js";
import { commentRouter } from "./commentRouter.js";
import { getPostsValidation } from "../validations/postValidation.js";
import { validate } from "../middlewares/validate.js";

export const postRouter = Router();

postRouter.get("/",getPostsValidation,validate,postController.getPosts);
postRouter.get("/recent",postController.getRecentPosts);
postRouter.get("/:postId",postController.getPostById);
postRouter.use("/:postId/comments",commentRouter)