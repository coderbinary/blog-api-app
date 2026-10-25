
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return next(
      new AppError(401, "Unauthorized: Admin token required"),
    );
  }

  let decoded: { id: number; username: string };

  try {
    decoded = jwt.verify(token, env.adminSecret) as {
      id: number;
      username: string;
    };
  } catch {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
    });

    return next(
      new AppError(401, "Unauthorized: Invalid or expired admin token"),
    );
  }

  if (
    decoded.username !== env.adminUsername ||
    !Number.isInteger(decoded.id)
  ) {
    return next(new AppError(403, "Forbidden: Admin access required"));
  }

  res.locals.user = decoded;
  return next();
};
