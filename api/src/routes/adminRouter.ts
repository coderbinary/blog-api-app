import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { deleteUserValidation, getUsersValidation, loginValidation } from "../validations/userValidation.js";
import { validate } from "../middlewares/validate.js";
import adminController from "../controllers/adminController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { createPostValidation, deletePostValidation, getPostsValidation, updatePostValidation } from "../validations/postValidation.js";
import { createCategoryValidation, deleteCategoryValidation, updateCategoryValidation } from "../validations/categoryValidation.js";
import { forceDeleteCommentValidation } from "../validations/commentValidation.js";

export const adminRouter = Router();

adminRouter.post("/login",loginValidation,validate,adminController.login);

adminRouter.use(requireAdmin);

// adminRouter.get("/auth/me", adminController.getAdmin);

adminRouter.get("/posts", getPostsValidation,validate,adminController.getAllPosts);
adminRouter.post("/posts", createPostValidation,validate,adminController.createPost);
adminRouter.patch("/posts/:postId", updatePostValidation,validate,adminController.updatePost);
adminRouter.delete("/posts/:postId", deletePostValidation,validate,adminController.deletePost);

adminRouter.post("/categories", createCategoryValidation,validate,adminController.createCategory);
adminRouter.patch("/categories/:id", updateCategoryValidation, adminController.updateCategory);
adminRouter.delete("/categories/:id",deleteCategoryValidation,validate,adminController.deleteCategory);

adminRouter.delete("/comments/:commentId",forceDeleteCommentValidation,validate,adminController.forceDeleteComment);
adminRouter.get("/users",getUsersValidation,validate,adminController.getUsers);
adminRouter.delete("/users/:userId",deleteUserValidation,validate,adminController.deleteUser);