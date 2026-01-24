import { Router } from 'express'
import { SecureRoute } from '../middlewares/SecureRoute.js'
import {
  AddPlanValidation,
  addPricePlan,
  deletePlan,
  getPricePlan,
} from '../Controllers/pricePlan.controller.js'

const router = Router()

// Add plan
router.post('/price-plan/add', SecureRoute, AddPlanValidation, addPricePlan)

// Get Plan
router.get('/plan/get', getPricePlan)

// delete Plan
router.delete('/plan/delete/:id', SecureRoute, deletePlan)

export default router
