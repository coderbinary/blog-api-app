import { Router } from "express";
import { loginValidation, registerValidation } from "../validations/userValidation.js";
import { validate } from "../middlewares/validate.js";
import userController from "../controllers/userController.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

export const userRouter = Router();

userRouter.post("/register",optionalAuth,registerValidation,validate,userController.register);
userRouter.post("/login",optionalAuth,loginValidation,validate,userController.login);
