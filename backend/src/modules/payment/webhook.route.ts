import express from "express";
import { stripeWebhook } from "./payment.controller";

const webhookRouter = express.Router();

webhookRouter.post("/stripe", stripeWebhook);

export default webhookRouter;
