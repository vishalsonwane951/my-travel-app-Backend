import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { uploaders } from '../../utils/cloudinary.js';
import {
  listBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost,
} from '../../Controllers/Admin/blogController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'content'));

router.get('/', listBlogPosts);
router.get('/:id', getBlogPost);
router.post('/', uploaders.blog.single('coverImage'), createBlogPost);
router.put('/:id', uploaders.blog.single('coverImage'), updateBlogPost);
router.delete('/:id', deleteBlogPost);

export default router;
