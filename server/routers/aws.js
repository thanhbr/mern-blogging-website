import express from 'express';
import { awsController } from '../controllers/index.js';

const router = express.Router();

router.get('/get-upload-url', awsController.getUploadURL);

export default router;