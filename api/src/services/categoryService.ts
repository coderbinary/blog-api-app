import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

const createCategoryService = async (name: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (existingCategory) {
    throw new AppError(409, "Category with this name already exists");
  }

  // 2. Create category
  const category = await prisma.category.create({
    data: { name },
    select: {
      id: true,
      name: true,
    },
  });

  return { category };
};

const updateCategoryService = async (id: number, name: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!existingCategory) {
    throw new AppError(404, "Category not found");
  }

  const nameConflict = await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      NOT: {
        id: id, // Exclude the current category being updated
      },
    },
    select: { id: true },
  });

  if (nameConflict) {
    throw new AppError(409, "Another category with this name already exists");
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name },
    select: {
      id: true,
      name: true,
    },
  });

  return { category };
};

const deleteCategoryService = async (id: number) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!existingCategory) {
    throw new AppError(404, "Category not found");
  }

  if (existingCategory._count.posts > 0) {
    throw new AppError(
      409,
      `Cannot delete category. It has ${existingCategory._count.posts} assigned post(s). Please reassign or delete those posts first.`
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return { success: true };
};

export default {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService
};