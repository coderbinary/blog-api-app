import express from "express";
import cors from "cors";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiRouter } from "./routes/apiRouter.js";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use("/api",apiRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}