import { Router } from 'express'
import { getNotifications } from '../Controllers/notifications.controller.js'
import { SecureRoute } from '../middlewares/SecureRoute.js'
const router = Router()

// Get Notifications
router.get('/notification/get', SecureRoute, getNotifications)

export default router
