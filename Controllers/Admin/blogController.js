import asyncHandler from 'express-async-handler';
import BlogPost from '../../Models/BlogPost.js';
import { deleteFromCloudinary } from '../../utils/cloudinary.js';

export const listBlogPosts = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.title = new RegExp(search, 'i');
  const [posts, total] = await Promise.all([
    BlogPost.find(filter).populate('author', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    BlogPost.countDocuments(filter),
  ]);
  res.json({ success: true, posts, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const getBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  res.json({ success: true, post });
});

export const createBlogPost = asyncHandler(async (req, res) => {
  const body = { ...req.body, author: req.user?._id };
  if (body.tags && typeof body.tags === 'string') body.tags = body.tags.split(';').map((s) => s.trim()).filter(Boolean);
  if (req.file) { body.coverImage = req.file.path; body.coverImagePublicId = req.file.filename; }

  const post = await BlogPost.create(body);
  await req.audit?.({ action: 'create', module: 'blog', targetId: post._id, after: { title: post.title } });
  res.status(201).json({ success: true, post });
});

export const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

  const body = { ...req.body };
  if (body.tags && typeof body.tags === 'string') body.tags = body.tags.split(';').map((s) => s.trim()).filter(Boolean);
  if (req.file) {
    if (post.coverImagePublicId) { try { await deleteFromCloudinary(post.coverImagePublicId); } catch (_) {} }
    body.coverImage = req.file.path;
    body.coverImagePublicId = req.file.filename;
  }

  Object.assign(post, body);
  await post.save();
  await req.audit?.({ action: 'update', module: 'blog', targetId: post._id });
  res.json({ success: true, post });
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  if (post.coverImagePublicId) { try { await deleteFromCloudinary(post.coverImagePublicId); } catch (_) {} }
  await post.deleteOne();
  await req.audit?.({ action: 'delete', module: 'blog', targetId: req.params.id });
  res.json({ success: true, message: 'Post deleted.' });
});

// Public — published posts for the (future) blog frontend
export const getPublishedPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({ status: 'published' }).sort({ publishedAt: -1 }).select('-content');
  res.json({ success: true, posts });
});

export const getPublishedPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  res.json({ success: true, post });
});
