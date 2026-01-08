import express from "express";
import { handleRedirect } from "./redirect.controller";

const redirectRouter = express.Router();

// Handle short URL redirect
redirectRouter.get("/:shortId", handleRedirect);

export default redirectRouter;
