import express from 'express';
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js';

const router = express.Router();

// Auth middleware
const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    
    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// @route   GET api/posts
// @desc    Get all posts
// @access  Private (both students and alumni)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private (alumni only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is alumni
    if (req.user.role !== 'alumni') {
      return res.status(403).json({ msg: 'Only alumni can create posts' });
    }

    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ msg: 'Post content is required' });
    }

    const newPost = new Post({
      content,
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      authorBatch: req.user.batch,
      authorBranch: req.user.branch,
      authorProfilePic: req.user.profile_picture || '',
      createdAt: new Date()
    });

    // Save the post
    const post = await newPost.save();
    
    // Return the saved post
    res.json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private (alumni can only delete their own posts)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user is the post author
    if (post.authorId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this post' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    const hasLiked = post.likes.some(like => like.user.toString() === req.user.id);
    if (hasLiked) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    // Add like to the post
    post.likes.unshift({
      user: req.user.id,
      name: req.user.name,
      role: req.user.role,
      profilePic: req.user.profile_picture || ''
    });

    // Save the post
    await post.save();

    // Return the updated likes array
    res.json(post.likes);
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has been liked by this user
    if (!post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Remove the like
    post.likes = post.likes.filter(
      like => like.user.toString() !== req.user.id
    );

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ msg: 'Comment text is required' });
    }

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      text,
      name: req.user.name,
      user: req.user.id,
      role: req.user.role,
      profilePic: req.user.profile_picture || ''
    };

    post.comments.unshift(newComment);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user is comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this comment' });
    }

    // Remove the comment
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
