import { Router } from 'express'
import {
  addSkills,
  AddSkillsValidation,
  deleteSkill,
  getSkills,
} from '../Controllers/skills.controller.js'
import { SecureRoute } from '../middlewares/SecureRoute.js'
const router = Router()

// Add Skills
router.post('/skill/add', SecureRoute, AddSkillsValidation, addSkills)

// Add Skills
router.get('/skill/get', getSkills)

// Delete Skill
router.delete('/skill/delete/:id', SecureRoute, deleteSkill)

export default router
