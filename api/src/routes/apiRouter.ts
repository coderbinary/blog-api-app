import { Router } from "express";
import { userRouter } from "./userRouter.js";
import { adminRouter } from "./adminRouter.js";
import { postRouter } from "./postRouter.js";

export const apiRouter = Router();

apiRouter.use("/user",userRouter);
apiRouter.use("/admin",adminRouter);
apiRouter.use("/posts",postRouter);