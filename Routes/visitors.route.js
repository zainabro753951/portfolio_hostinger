import { Router } from 'express'
import { addVisitors } from '../Controllers/visitors.controller.js'

const router = Router()

router.post('/add/visitors', addVisitors)

export default router
