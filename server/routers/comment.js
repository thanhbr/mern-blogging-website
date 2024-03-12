import express from 'express';
import { commentController } from '../controllers/index.js';

const router = express.Router();

router.post('/create', commentController.create);


export default router;