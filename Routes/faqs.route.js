import { Router } from 'express'
import { SecureRoute } from '../middlewares/SecureRoute.js'
import { addFAQs, deleteFAQ, faqsValidation, getFAQs } from '../Controllers/faqs.controller.js'
const r = Router()

// Add Faqs Route
r.post('/faq/add', SecureRoute, faqsValidation, addFAQs)

// Get Faqs Route
r.get('/faq/get', getFAQs)

// Delete Faqs route
r.delete('/faq/delete/:id', SecureRoute, deleteFAQ)

export default r
