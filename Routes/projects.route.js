import { Router } from 'express'
import {
  addOrUpdateProject,
  AddProjectValidation,
  deleteProject,
  getProjects,
} from '../Controllers/project.controller.js'
const router = Router()
import { SecureRoute } from '../middlewares/SecureRoute.js'
import upload from '../Utils/multer.js'

// Add Project
router.post(
  '/project/add/',
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'ogProjectImage', maxCount: 1 },
    { name: 'gallery', maxCount: 12 },
  ]),
  SecureRoute,
  AddProjectValidation,
  addOrUpdateProject
)

router.post(
  '/project/add/:id',
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'ogProjectImage', maxCount: 1 },
    { name: 'gallery', maxCount: 12 },
  ]),
  SecureRoute,
  AddProjectValidation,
  addOrUpdateProject
)

router.get('/project/get', getProjects)

// Delete Project
router.delete('/project/delete/:id', SecureRoute, deleteProject)

export default router
