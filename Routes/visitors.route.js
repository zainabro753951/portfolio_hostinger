import { Router } from "express";
import {
  addVisitors,
  getVisitorsCount,
} from "../Controllers/visitors.controller.js";
import { SecureRoute } from "../middlewares/SecureRoute.js";

const router = Router();

router.post("/add/visitors", addVisitors);

router.get("/visitors/count", SecureRoute, getVisitorsCount);

export default router;
