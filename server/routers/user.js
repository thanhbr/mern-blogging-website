import express from 'express';
import { userController } from '../controllers/index.js';

const router = express.Router();

router.post('/sign-up', userController.register)

router.post('/sign-in', userController.login)


export default router;