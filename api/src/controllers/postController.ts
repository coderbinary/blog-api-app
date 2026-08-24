import type { Request, Response, NextFunction } from "express";
import postService from "../services/postService.js";
import { AppError } from "../errors/AppError.js";
import { matchedData } from "express-validator";

const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'desc', 
      category 
    } = matchedData(req);

    const result = await postService.getPostsService({
      page,
      limit,
      sort,
      category,
    });

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: result.posts,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

const getRecentPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postService.getRecentPosts();
    return res.status(200).json({
      success: true,
      message: "Recent Posts Found",
      posts: result.posts
    })
  } catch (err) {
    next(err);
  }
}

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params
    const id = Number(postId);
    if(isNaN(id)){
      throw new AppError(400,"Invalid Post Id")
    }
    const result = await postService.getPostByIdService(id);
    if(!result?.post) {
      throw new AppError(404,"Post Not Found")
    }
    return res.status(200).json({
      success: true,
      message: 'Post Found Successfully',
      post: result.post
    })
  } catch (err) {
    next(err);
  }
}
export default {
  getPosts,
  getRecentPosts,
  getPostById
}