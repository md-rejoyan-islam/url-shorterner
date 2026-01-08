import express from "express";
import { authorize } from "../../middlewares/authorized";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import {
  createPlan,
  deletePlan,
  getAllPlans,
  getAllPlansAdmin,
  getDefaultPlan,
  getPlanById,
  getPlanBySlug,
  seedPlans,
  updatePlan,
} from "./plan.controller";
import { UserRole } from "../user/user.type";
import {
  createPlanSchema,
  getAllPlansQuerySchema,
  updatePlanSchema,
} from "./plan.validation";

const planRouter = express.Router();

// Public routes
planRouter.get("/", validate(getAllPlansQuerySchema), getAllPlans);
planRouter.get("/default", getDefaultPlan);
planRouter.get("/slug/:slug", getPlanBySlug);

// Admin routes
planRouter.use(isLoggedIn, authorize([UserRole.ADMIN]));

planRouter.get("/admin", validate(getAllPlansQuerySchema), getAllPlansAdmin);
planRouter.post("/", validate(createPlanSchema), createPlan);
planRouter.post("/seed", seedPlans);
planRouter.get("/:id", getPlanById);
planRouter.put("/:id", validate(updatePlanSchema), updatePlan);
planRouter.delete("/:id", deletePlan);

export default planRouter;
