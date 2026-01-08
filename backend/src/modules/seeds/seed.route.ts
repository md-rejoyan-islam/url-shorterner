import express from "express";
import {
  seedAll,
  seedPayments,
  seedPlans,
  seedSubscriptions,
  seedUrls,
  seedUsers,
} from "./seed.controller";

const seedRouter = express.Router();

seedRouter.get("/users", seedUsers);
seedRouter.get("/urls", seedUrls);
seedRouter.get("/plans", seedPlans);
seedRouter.get("/subscriptions", seedSubscriptions);
seedRouter.get("/payments", seedPayments);
seedRouter.get("/all", seedAll);

export default seedRouter;
