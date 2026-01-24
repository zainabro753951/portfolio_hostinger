import { Router } from 'express'
import { SecureRoute } from '../middlewares/SecureRoute.js'
import {
  addTestimonial,
  AddTestimonialValidation,
  deleteTestimonial,
  getTestimonial,
} from '../Controllers/testimonials.controller.js'
import upload from '../Utils/multer.js'

const router = Router()

// Add Testimonial
router.post(
  '/testimonial/add',
  upload.single('clientImage'),
  SecureRoute,
  AddTestimonialValidation,
  addTestimonial
)

// Get Testimonials
router.get('/testimonial/get', getTestimonial)

// Delete Testimonial
router.delete('/testimonial/delete/:id', SecureRoute, deleteTestimonial)

export default router
