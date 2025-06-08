import { Router } from "express";

const healthRouter: Router = Router();

healthRouter.get("/", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { healthRouter };
