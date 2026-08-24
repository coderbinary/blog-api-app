import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export const getCommentsOfPostService = async (
  postId: number,
  options: { page: number; limit: number; sort: "asc" | "desc" },
) => {
  const { page, limit, sort } = options;
  const skip = (page - 1) * limit;

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: sort },
    take: limit,
    skip: skip,
    select: {
      id: true,
      author: {
        select: {
          username: true,
        },
      },
      body: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { comments };
};

const createCommentOnPostService = async ({
  userId,
  postId,
  body,
}: {
  userId: number;
  postId: number;
  body: string;
}) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
      },
    });
    if (!existingUser) {
      throw new AppError(401, "User Does not exist");
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });
    if (!existingPost) {
      throw new AppError(404, "Post Does Not Exist");
    }
    const comment = await prisma.comment.create({
      data: {
        body,
        authorId: userId,
        postId,
      },
      select: {
        id: true,
        body: true,
        author: {
          select: {
            username: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        postId: true,
      },
    });
    return { comment };
  } catch (err) {
    throw err;
  }
};

const updateCommentOnPostService = async ({
  userId,
  postId,
  commentId,
  body,
}: {
  userId: number;
  postId: number;
  commentId: number;
  body: string;
}) => {

  const existingComment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      postId: postId,
    },
    select: {
      authorId: true,
    },
  });

  if (!existingComment) {
    throw new AppError(404, "Comment or Post not found");
  }

  if (existingComment.authorId !== userId) {
    throw new AppError(403, "You are not authorized to edit this comment");
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { body },
    select: {
      id: true,
      body: true,
      author: {
        select: {
          username: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      postId: true,
    },
  });

  return { comment: updatedComment };
};

const deleteCommentOnPostService = async ({
  userId,
  postId,
  commentId,
}: {
  userId: number;
  postId: number;
  commentId: number;
}) => {
  const existingComment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      postId: postId,
    },
    select: {
      authorId: true,
    },
  });

  if (!existingComment) {
    throw new AppError(404, "Comment or Post not found");
  }

  if (existingComment.authorId !== userId) {
    throw new AppError(403, "You are not authorized to delete this comment");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return { success: true };
};

const forceDeleteCommentService = async (commentId: number) => {

  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true },
  });

  if (!existingComment) {
    throw new AppError(404, "Comment not found");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return { success: true };
};

export default {
  getCommentsOfPostService,
  createCommentOnPostService,
  updateCommentOnPostService,
  deleteCommentOnPostService,
  forceDeleteCommentService,
};
