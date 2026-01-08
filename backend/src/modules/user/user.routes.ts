import express from "express";
import { authorize } from "../../middlewares/authorized";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./user.controller";
import { UserRole } from "./user.type";
import {
  createUserSchema,
  getAllUsersQuerySchema,
  updateUserSchema,
} from "./user.validation";

const userRouter = express.Router();

// All routes require authentication and admin privileges
userRouter.use(isLoggedIn, authorize([UserRole.ADMIN]));

// Admin routes for user management
userRouter.get("/", validate(getAllUsersQuerySchema), getAllUsers);
userRouter.post("/", validate(createUserSchema), createUser);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", validate(updateUserSchema), updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
