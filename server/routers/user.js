import express from 'express';
import { userController } from '../controllers/index.js';

const router = express.Router();

router.post('/sign-up', userController.register);
router.post('/sign-in', userController.login);
router.post('/google-auth', userController.googleAuth);
router.post('/search', userController.search);
router.post('/profile', userController.getProfile);


export default router;