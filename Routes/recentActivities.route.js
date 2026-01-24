import { Router } from "express";
import {SecureRoute} from "../middlewares/SecureRoute.js"
import getActivities from "../Controllers/recentActivities.controller.js";
const router = Router()

// Get Recent Activities
router.get("/get/activities", SecureRoute, getActivities)

export default router
