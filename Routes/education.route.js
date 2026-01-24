import { Router } from 'express'
import {
  addEducation,
  AddEducationValidation,
  deleteEducation,
  getEducation,
} from '../Controllers/education.controller.js'
import { SecureRoute } from '../middlewares/SecureRoute.js'
import upload from '../Utils/multer.js'
const router = Router()

// Add Education
router.post(
  '/education/add',
  SecureRoute,
  upload.single('certificate'),
  AddEducationValidation,
  addEducation
)

// Get Education
router.get('/education/get', getEducation)

// Delete Education
router.delete('/education/delete/:id', SecureRoute, deleteEducation)

export default router
