import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { matchedData } from "express-validator";
import type { UserLoginData } from "../types/userTypes.js";
import { env } from "../config/env.js";
import bcrypt from "bcryptjs";
import { generateAdminToken } from "../lib/token.js";
import postService from "../services/postService.js";
import categoryService from "../services/categoryService.js";
import commentService from "../services/commentService.js";
import userService from "../services/userService.js";

interface PostCreationData {
  title: string;
  description?: string;
  coverImageUrl?: string;
  content: string;
  published?: boolean;
  categoryId: number;
}

interface PostUpdateData {
  postId: number;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  content?: string;
  published?: boolean;
  categoryId?: number;
}

interface DeletePostData {
  postId: number;
}

interface CreateCategoryData {
  name: string;
}

interface UpdateCategoryData {
  id: number;
  name: string;
}

interface DeleteCategoryData {
  id: number;
}

interface ForceDeleteCommentData {
  commentId: number;
  postId: number;
}

interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

interface DeleteUserData {
  userId: number;
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals?.user;
    if (user) {
      throw new AppError(401, "Already Logged In");
    }
    const data = matchedData<UserLoginData>(req);
    if (data.username !== env.adminUsername) {
      throw new AppError(403, "Access Denied: Not an admin account");
    }
    let admin = await prisma.user.findUnique({
      where: {
        username: env.adminUsername,
      },
    });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      admin = await prisma.user.create({
        data: {
          username: env.adminUsername,
          email: env.adminEmail,
          password: hashedPassword,
        },
      });
    } else {
      const isMatch = await bcrypt.compare(data.password, admin.password);
      if (!isMatch) {
        throw new AppError(401, "Invalid credentials");
      }
    }
    const token = generateAdminToken(admin.id, admin.username);
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Admin Logged In Successfully",
      user: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    next(err);
  }
};

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, sort = "desc", category } = matchedData(req);

    const result = await postService.getPostsService({
      page,
      limit,
      sort,
      category,
      isAdmin: true,
    });

    res.status(200).json({
      success: true,
      message: "Admin Posts fetched successfully",
      posts: result.posts,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminUser = res.locals.user;
    const data = matchedData<PostCreationData>(req);
    const result = await postService.createPostService({
      ...data,
      authorId: adminUser.id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: result.post,
    });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = matchedData<PostUpdateData>(req, {
      locations: ["params", "body"],
    });

    const result = await postService.updatePostService(data);

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: result.post,
    });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = matchedData<DeletePostData>(req, {
      locations: ["params"],
    });

    await postService.deletePostService(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = matchedData<CreateCategoryData>(req);

    const result = await categoryService.createCategoryService(name);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: result.category,
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name } = matchedData<UpdateCategoryData>(req, {
      locations: ["params", "body"],
    });

    const result = await categoryService.updateCategoryService(id, name);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: result.category,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = matchedData<DeleteCategoryData>(req, {
      locations: ["params"],
    });

    await categoryService.deleteCategoryService(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const forceDeleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId, commentId } = matchedData<ForceDeleteCommentData>(req);

    await commentService.forceDeleteCommentService(postId, commentId);

    return res.status(200).json({
      success: true,
      message: "Comment force deleted successfully by admin",
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryData = matchedData<GetUsersQuery>(req, {
      locations: ["query"],
    });

    const result = await userService.getUsersService(queryData);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = matchedData<DeleteUserData>(req, {
      locations: ["params"],
    });

    // Get current logged-in admin user from auth middleware
    const currentAdminId = res.locals.user.id;

    // Call service passing target userId and currentAdminId
    await userService.deleteUserService(userId, currentAdminId);

    res.status(200).json({
      success: true,
      message: "User and all associated data deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;

    return res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  createCategory,
  updateCategory,
  deleteCategory,
  forceDeleteComment,
  getUsers,
  deleteUser,
  getAdmin
};
