import { Router } from 'express';
import { AddAbout, AddAboutValidator, getAbout } from '../Controllers/about.controller.js';
import { SecureRoute } from '../middlewares/SecureRoute.js';
import upload from '../Utils/multer.js';
const router = Router();

// Add About
router.post(
  '/about/add',
  upload.fields([
    { name: 'aboutImage', maxCount: 1 },
    { name: 'poseImage', maxCount: 1 },
  ]),
  AddAboutValidator,
  SecureRoute,
  AddAbout
);

// Get About
router.get('/about/get', getAbout);

export default router;
