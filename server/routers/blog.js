import express from 'express';
import { blogController } from '../controllers/index.js';

const router = express.Router();

router.post("/create", blogController.create);
router.post("/search", blogController.search);
router.post("/latest", blogController.latestBlog);
router.post("/all-latest-count", blogController.allLatestBlog);
router.post("/search-count", blogController.searchCount);
router.post("/detail", blogController.getDetail);
router.post("/favorite", blogController.favorite);
router.post("/isliked-by-user", blogController.isLikedByUser);

router.get("/trending", blogController.trendingBlog);



export default router;