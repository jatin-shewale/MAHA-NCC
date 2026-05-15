import Post from '../models/Post.js';
import Notification from '../models/Notification.js'; // I'll create this model next

export const createPost = async (req, res) => {
  try {
    const { content, category, images } = req.body;

    const post = await Post.create({
      user: req.user._id,
      content,
      category,
      images, // URL from Cloudinary (handled by frontend or middleware)
      status: 'pending', // All cadet posts start as pending
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    // Only show approved posts in the main feed
    const posts = await Post.find({ status: 'approved' })
      .populate('user', 'name rank unit avatar')
      .sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingPosts = async (req, res) => {
  try {
    // ANO only: Get posts pending review for their unit
    const posts = await Post.find({ status: 'pending' })
      .populate('user', 'name rank unit')
      .sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const moderatePost = async (req, res) => {
  try {
    const { postId, status } = req.body; // status: 'approved' or 'rejected'
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { 
        status, 
        reviewedBy: req.user._id 
      },
      { new: true }
    );

    // Send real-time notification to the cadet via Socket.io
    const io = req.app.get('io');
    io.to(post.user.toString()).emit('post-status-update', {
      postId,
      status,
      message: `Your achievement post has been ${status}.`
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
