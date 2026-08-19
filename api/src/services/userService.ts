import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { generateUserToken } from "../lib/token.js";
import type { UserLoginData, UserRegistrationData } from "../types/userTypes.js"

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

export default {
  register,login
}