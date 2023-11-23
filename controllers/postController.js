const mongoose = require("mongoose");
const Post = require("../models/posts");
const User = require("../models/users");

// get all posts
const getPosts = async (req, res) => {
	try {
		const posts = await Post.find();
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// get post by id
const getPostById = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	const post = await Post.findById(id);
	res.status(200).json(post);
};


// create post
const createPost = async (req, res) => {
	const { author: postAuthor, ...post } = req.body;
	if (!postAuthor || !post.postText) {
		return res.status(400).json({ message: "Author and text is required." });
	}
	try {
		const user = await User.findOne({ userTag: postAuthor });
		if (!user) return res.status(400).json({ message: "Author does not exist." });
		const newPost = new Post({ ...post, userId: user._id, author: postAuthor });
		try {
			await newPost.save();
			res.status(201).json(newPost);
		} catch (error) {
			res.status(409).json({ message: error.message });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	getPosts,
	getPostById,
	createPost,
};
