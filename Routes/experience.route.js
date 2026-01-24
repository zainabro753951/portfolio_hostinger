import { Router } from 'express'
import { SecureRoute } from '../middlewares/SecureRoute.js'
import { addExp, deleteExp, getExp } from '../Controllers/experience.controller.js'
import upload from '../Utils/multer.js'
const router = Router()

// Add Experience
router.post('/experience/add', SecureRoute, upload.single('companyLogo'), addExp)

// Get Experience
router.get('/experience/get', getExp)

// Delete Experience
router.delete('/experience/delete/:id', SecureRoute, deleteExp)

export default router
