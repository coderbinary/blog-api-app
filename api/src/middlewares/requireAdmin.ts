import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    throw new AppError(401, "Unauthorized: Admin token required");
  }

  try {
    const decoded = jwt.verify(token, env.adminSecret) as { id: number; username: string };

    if (decoded.username !== env.adminSecret) {
      throw new AppError(403, "Forbidden: Admin access required");
    }

    res.locals.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("admin_token");
    throw new AppError(401, "Unauthorized: Invalid or expired admin token");
  }
};