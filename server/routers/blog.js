import express from 'express';
import { blogController } from '../controllers/index.js';

const router = express.Router();

router.post('/create', blogController.create);
router.get("/latest", blogController.latestBlog)


export default router;