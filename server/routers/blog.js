import express from 'express';
import { blogController } from '../controllers/index.js';

const router = express.Router();

router.post('/create', blogController.create);


export default router;