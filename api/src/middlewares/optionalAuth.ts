import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from '../config/env.js';

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.user_token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.userSecret) as { id: number; username: string };
    res.locals.user = decoded;
  } catch (err) {
    res.clearCookie('user_token');
  }

  next();
};