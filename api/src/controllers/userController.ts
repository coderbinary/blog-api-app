import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import userService from "../services/userService.js";
import { matchedData } from "express-validator";
import type { UserLoginData,UserRegistrationData } from "../types/userTypes.js";
import { env } from "../config/env.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals?.user;
    if (user) {
      throw new AppError(401, "Already Logged In");
    }
    const data = matchedData<UserRegistrationData>(req);
    const result = await userService.register(data);
    res.cookie("user_token", result.token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: { id: result.id, username: result.username },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals?.user;
    if (user) {
      throw new AppError(401, "Already Logged In");
    }
    const data = matchedData<UserLoginData>(req);
    const result = await userService.login(data);
    res.cookie("user_token",result.token,{
      httpOnly: true,
      secure: env.isProduction,
      sameSite:'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(200).json({
      success: true,
      message: 'User Logged In',
      user: { id: result.id, username: result.username }
    })
  } catch (err) {
    next(err);
  }
};
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals?.user;

    if (!user) {
      return res.status(200).json({
        success: true,
        isLoggedIn: false,
        user: null,
      });
    }

    res.status(200).json({
      success: true,
      isLoggedIn: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
export default {
  register,
  login,
  getUser
};
