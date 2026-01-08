import { NextFunction, Request, Response } from "express";
import z from "zod";
import { asyncHandler } from "../helper/async-handler";

const validate = (schema: z.ZodType) =>
  asyncHandler(
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      })) as {
        body?: unknown;
        query?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) {
        for (const key of Object.keys(req.query)) {
          delete req.query[key];
        }
        Object.assign(req.query, parsed.query);
      }

      if (parsed.params) {
        for (const key of Object.keys(req.params)) {
          delete req.params[key];
        }
        Object.assign(req.params, parsed.params);
      }

      return next();
    }
  );

export default validate;
