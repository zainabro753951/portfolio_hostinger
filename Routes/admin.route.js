import { Router } from 'express'
import {
  superAdminReg,
  RegValidation,
  loginValidation,
  superAdminLogin,
  adminAuth,
} from '../Controllers/superAdmin.controller.js'
import { SecureRoute } from '../middlewares/SecureRoute.js'
const router = Router()

router.post('/super-admin/register', RegValidation, superAdminReg)

// Super admin login
router.post('/super-admin/login', loginValidation, superAdminLogin)

// Admin Authenticated Route
router.post('/super-admin/auth', SecureRoute, adminAuth)

export default router
