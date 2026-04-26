import { Router } from "express";
import { contactRateLimiter } from "../middlewares/contactRateLimitter.js";
import {
  contactMessageValidation,
  deleteContactMessages,
  emailHistory,
  getMessage,
  replyMessage,
  sendMessage,
  toggleReadStatus,
} from "../Controllers/contactMessage.controller.js";
import { SecureRoute } from "../middlewares/SecureRoute.js";
import upload from "../Utils/multer.js";

const router = Router();
// Send messages
router.post(
  "/message/send",
  contactRateLimiter,
  contactMessageValidation,
  sendMessage,
);

// Get Messages
router.get("/message/get", SecureRoute, getMessage);

// Delete Contact Messages
router.delete("/message/delete", SecureRoute, deleteContactMessages);

// mark as read
router.post("/message/mark-as-read", SecureRoute, toggleReadStatus);

router.post("/message/reply", upload.array("attachments", 5), replyMessage);

// Get Email History
router.get("/:id/email-history", emailHistory);

export default router;
