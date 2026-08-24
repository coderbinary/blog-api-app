import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { generateUserToken } from "../lib/token.js";
import type { UserLoginData, UserRegistrationData } from "../types/userTypes.js"
import type { Prisma } from "../generated/prisma/client.js";

interface GetUsersInput {
  page?: number;
  limit?: number;
  search?: string;
}

const register = async (data: UserRegistrationData) => {
  try {
    const {username,email,password} = data;
    const existingUser = await prisma.user.findUnique({
      where: {
        username
      }
    });
    if(existingUser) {
      throw new AppError(409,'User Already Exists');
    }
    const hashPassword = await bcrypt.hash(password,10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashPassword
      }
    });
    const token = generateUserToken(newUser.id,newUser.username);
    return { username: newUser.username,id: newUser.id,token };
  }catch(err){
    throw err;
  }
}

const login = async (data: UserLoginData) => {
  try {
    const { username, password } = data;
    const existingUser = await prisma.user.findUnique({
      where: {username},
      select: {
        username: true,
        id: true,
        password: true
      }
    });
    if(!existingUser) {
      throw new AppError(401,'Invalid Username or Password');
    }
    const isMatch = await bcrypt.compare(password,existingUser.password);
    if(!isMatch) {
      throw new AppError(401,'Invalid Username or Password');
    }
    const token = generateUserToken(existingUser.id,existingUser.username);
    return { username: existingUser.username, id: existingUser.id, token};
  } catch(err) {
    throw err
  }
}

const getUsersService = async (input: GetUsersInput) => {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const skip = (page - 1) * limit;

  // Build filter condition for search
  const where: Prisma.UserWhereInput = input.search
    ? {
        OR: [
          { username: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
        ],
      }
    : {};

  // Execute database query and total count in parallel
  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      totalUsers,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const deleteUserService = async (userId: number, currentAdminId: number) => {
  // 1. Prevent admin from deleting their own account via this endpoint
  if (userId === currentAdminId) {
    throw new AppError(400, "You cannot delete your own admin account");
  }

  // 2. Check if the target user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  // 3. Delete user (Postgres automatically cascades and deletes their posts & comments)
  await prisma.user.delete({
    where: { id: userId },
  });

  return { success: true };
};

export default {
  register,login,getUsersService,deleteUserService
}