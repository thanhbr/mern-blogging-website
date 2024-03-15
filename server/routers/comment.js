import express from 'express';
import { commentController } from '../controllers/index.js';

const router = express.Router();

router.post('/create', commentController.create);
router.post('/get-blog-comments', commentController.getBlogComments);
router.post('/get-replies', commentController.getReplies);
router.post('/delete-comment', commentController.deleteComment);


export default router;