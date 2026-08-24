import { AppError } from "../errors/AppError.js";
import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js"

interface CreatePostInput {
  title: string;
  description?: string;
  coverImageUrl?: string;
  content: string;
  published?: boolean;
  categoryId: number;
  authorId: number;
}

interface UpdatePostInput {
  postId: number;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  content?: string;
  published?: boolean;
  categoryId?: number;
}

const getRecentPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3,
      select: {
        description: true,
        content: true,
        createdAt: true,
        title: true,
        category: {
          select: {
            name: true
          }
        },
        author: {
          select: {
            username: true
          }
        }
      }
    })
    return {posts};
  } catch(err) {
    throw err
  }
}

const getPostByIdService = async (id: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        published: true,
        id
      },
      select: {
        author: {
          select: {
            username: true
          }
        },
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            name: true
          }
        }
      }
    });
    return {post};
  } catch(err) {
    throw err;
  }
}

const getPostsService = async ({
  page,
  limit,
  sort,
  category,
  isAdmin = false,
}: {
  page: number;
  limit: number;
  sort: "asc" | "desc";
  category?: string;
  isAdmin?: boolean;
}) => {
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.PostWhereInput = {};

  if (!isAdmin) {
    whereCondition.published = true;
  }

  if (category) {
    whereCondition.category = {
      name: category,
    };
  }

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        createdAt: sort,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImageUrl: true,
        published: true, // Needed for admin UI badges (Draft vs Published)
        createdAt: true,
        updatedAt: true,
        author: {
          select: { username: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.post.count({ where: whereCondition }),
  ]);

  return {
    posts,
    meta: {
      total: totalPosts,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
    },
  };
};

const createPostService = async (input: CreatePostInput) => {
  const { title, description, coverImageUrl, content, published = false, categoryId, authorId } = input;

  // 1. Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!existingCategory) {
    throw new AppError(404, "Selected category does not exist");
  }

  // 2. Generate slug from title
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // 3. Create post in database
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      description: description ?? null,
      coverImageUrl: description ?? null,
      content,
      published,
      categoryId,
      authorId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImageUrl: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { id: true, name: true } },
      author: { select: { id: true, username: true } },
    },
  });

  return { post };
};

const updatePostService = async (input: UpdatePostInput) => {
  const { postId, title, description, coverImageUrl, content, published, categoryId } = input;

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, title: true },
  });

  if (!existingPost) {
    throw new AppError(404, "Post not found");
  }

  if (categoryId !== undefined) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!existingCategory) {
      throw new AppError(404, "Selected category does not exist");
    }
  }

  const updateData: Record<string, any> = {};

  if (title !== undefined) {
    updateData.title = title;
    updateData.slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (content !== undefined) updateData.content = content;
  if (published !== undefined) updateData.published = published;
  if (categoryId !== undefined) updateData.categoryId = categoryId;

  if (description !== undefined) {
    updateData.description = description ? description : null;
  }
  if (coverImageUrl !== undefined) {
    updateData.coverImageUrl = coverImageUrl ? coverImageUrl : null;
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: updateData,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImageUrl: true,
      content: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { id: true, name: true } },
      author: { select: { id: true, username: true } },
    },
  });

  return { post: updatedPost };
};

const deletePostService = async (postId: number) => {

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!existingPost) {
    throw new AppError(404, "Post not found");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { success: true };
};

export default {
  getRecentPosts,
  getPostByIdService,
  getPostsService,
  createPostService,
  updatePostService,
  deletePostService,
}