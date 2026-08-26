import { Router } from "express";
import commentController from "../controllers/commentController.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import {
  createCommentValidation,
  deleteCommentValidation,
  updateCommentValidation,
} from "../validations/commentValidation.js";
import { validate } from "../middlewares/validate.js";

export const commentRouter = Router({
  mergeParams: true,
});

commentRouter.get("/", commentController.getCommentsOfPost);
commentRouter.post(
  "/",
  optionalAuth,
  createCommentValidation,
  validate,
  commentController.createCommentOnPost,
);
commentRouter.patch(
  "/:commentId",
  optionalAuth,
  updateCommentValidation,
  validate,
  commentController.updateCommentOnPost
);
commentRouter.delete(
  "/:commentId",
  optionalAuth,
  deleteCommentValidation,
  validate,
  commentController.deleteCommentOnPost,
);