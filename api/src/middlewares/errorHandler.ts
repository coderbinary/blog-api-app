import { type Request, type Response, type NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    res.status(409).json({
      success: false,
      message: "A record with these unique fields already exists",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
  return;
}
