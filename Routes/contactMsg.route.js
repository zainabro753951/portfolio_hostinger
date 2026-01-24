import { Router } from 'express'
import { contactRateLimiter } from '../middlewares/contactRateLimitter.js'
import {
  contactMessageValidation,
  deleteContactMessages,
  getMessage,
  sendMessage,
  toggleReadStatus,
} from '../Controllers/contactMessage.controller.js'
import { SecureRoute } from '../middlewares/SecureRoute.js'

const router = Router()
// Send messages
router.post('/message/send', contactRateLimiter, contactMessageValidation, sendMessage)

// Get Messages
router.get('/message/get', SecureRoute, getMessage)

// Delete Contact Messages
router.post('/message/delete', SecureRoute, deleteContactMessages)

// mark as read
router.post('/message/mark-as-read', SecureRoute, toggleReadStatus)

export default router
