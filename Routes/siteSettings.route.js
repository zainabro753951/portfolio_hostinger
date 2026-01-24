import { Router } from 'express'
import { addSiteSettings, getSiteSettings } from '../Controllers/siteSettings.controller.js'
import { SecureRoute } from '../middlewares/SecureRoute.js'
import upload from '../Utils/multer.js'
const router = Router()

// Add Site Settings
router.post(
  '/site-settings/add',
  SecureRoute,
  upload.fields([
    { name: 'siteInfo[logoImage]', maxCount: 1 },
    { name: 'siteInfo[favicon]', maxCount: 1 },
  ]),
  addSiteSettings
)

// Get Site Settings
router.get('/site-settings/get', getSiteSettings)

export default router
