import type { Request, Response, NextFunction } from "express";

import { AppError } from "../errors/AppError.js";
import commentService from "../services/commentService.js";
import { matchedData } from "express-validator";

type User = {
  id: number;
  username: string;
};

const getCommentsOfPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawPostId = req.params.postId;
    const postId = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;
    const id = Number(postId);

    if (!postId || isNaN(id)) {
      throw new AppError(400, "Invalid Post Id");
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = 10;
    const rawSort = req.query.sort;
    const sort: "asc" | "desc" = rawSort === "asc" ? "asc" : "desc";

    const result = await commentService.getCommentsOfPostService(id, {
      page,
      limit,
      sort,
    });

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments: result.comments,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};


const createCommentOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: User = res.locals.user;
    if (!user) throw new AppError(401, "Unauthorized");

    const { postId, body } = matchedData(req);

    const result = await commentService.createCommentOnPostService({
      userId: user.id,
      postId,
      body,
    });

    res.status(201).json({
      success: true,
      message: "Comment Created Successfully",
      comment: result.comment,
    });
  } catch (err) {
    next(err);
  }
};

const updateCommentOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: User = res.locals.user;
    if (!user) throw new AppError(401, "Unauthorized");

    const { postId, commentId, body } = matchedData(req);

    const result = await commentService.updateCommentOnPostService({
      userId: user.id,
      postId,
      commentId,
      body,
    });

    res.status(200).json({
      success: true,
      message: "Comment Updated Successfully",
      comment: result.comment,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCommentOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: User = res.locals.user;
    if (!user) throw new AppError(401, "Unauthorized");

    const { postId, commentId } = matchedData(req);

    await commentService.deleteCommentOnPostService({
      userId: user.id,
      postId,
      commentId,
    });

    res.status(200).json({
      success: true,
      message: "Comment Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};  

export default {
  getCommentsOfPost,
  createCommentOnPost,
  updateCommentOnPost,
  deleteCommentOnPost
};
