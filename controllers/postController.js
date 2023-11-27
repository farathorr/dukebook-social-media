const mongoose = require("mongoose");
const Post = require("../models/posts");
const { User } = require("../models/users");

// get all posts
const getPosts = async (req, res) => {
	try {
		const posts = await Post.find().populate("user");
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
	const post = await Post.findById(id)
		.populate("user")
		.populate("comments")
		.populate({
			path: "comments",
			populate: {
				path: "user",
				model: "User",
			},
		});
	console.log(post);
	res.status(200).json(post);
};

// search posts by text
const searchPosts = async (req, res) => {
	const { search } = req.params;
	try {
		const wordCount = decodeURI(search).split(" ").length;

		if (wordCount > 1) {
			const posts = await Post.find({ $text: { $search: search } }, { score: { $meta: "textScore" } }).sort({
				score: { $meta: "textScore" },
			});
			return res.json(posts);
		} else {
			const posts = await Post.find({ postText: { $regex: search, $options: "i" } });
			return res.json(posts);
		}
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

//get posts by userTag
const getPostsByAuthor = async (req, res) => {
	const { userTag } = req.params;
	try {
		const user = await User.findOne({ userTag: userTag });
		if (!user) return res.status(400).json({ message: "User does not exist." });
		const posts = await Post.find({ userId: user._id }).populate("comments");
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// create post
const createPost = async (req, res) => {
	const { userTag: postAuthor, ...post } = req.body;
	if (!postAuthor) {
		return res.status(400).json({ message: "UserTag is required." });
	}
	if (!post.postText) {
		return res.status(400).json({ message: "Post text is required." });
	}
	try {
		const user = await User.findOne({ userTag: postAuthor });
		if (!user) return res.status(400).json({ message: "User does not exist." });
		try {
			const newPost = new Post({ ...req.body, user });
			newPost.populate("user");
			await newPost.save();
			res.status(201).json(newPost);
		} catch (error) {
			res.status(409).json({ message: error.message });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const updatePost = async (req, res) => {
	const { id } = req.params;
	const { userTag: postAuthor, ...post } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		const user = await User.findOne({ userTag: postAuthor });
		if (!user) return res.status(400).json({ message: "User does not exist." });
		const updatedPost = await Post.findByIdAndUpdate(id, { ...post, userId: user._id, userTag: postAuthor }, { new: true });
		res.json(updatedPost);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const deletePost = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		await Post.findByIdAndRemove(id);
		res.json({ message: "Post deleted successfully." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const likePost = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		const post = await Post.findById(id);
		if (post.likes.some((id) => id.toString() === userId)) {
			post.likes.pull(userId);
		} else if (post.dislikes.some((id) => id.toString() === userId)) {
			post.dislikes.pull(userId);
			post.likes.push(userId);
		} else {
			post.likes.push(userId);
		}
		post.save();
		res.json(post);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const dislikePost = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		const post = await Post.findById(id);
		console.log(post.dislikes.some((id) => id.toString() === userId));
		if (post.dislikes.some((id) => id.toString() === userId)) {
			post.dislikes.pull(userId);
		} else if (post.likes.some((id) => id.toString() === userId)) {
			post.likes.pull(userId);
			post.dislikes.push(userId);
		} else {
			post.dislikes.push(userId);
		}
		post.save();
		res.json(post);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const replyToPost = async (req, res) => {
	const { id } = req.params;
	const { userTag: replyAuthor, ...post } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}

	try {
		const user = await User.findOne({ userTag: replyAuthor });
		if (!user) return res.status(400).json({ message: "User does not exist." });
		const post = await Post.findById(id);
		const newPost = new Post({ ...req.body, user });
		if (!post.originalPostParentId) {
			newPost.originalPostParentId = id;
		} else {
			newPost.originalPostParentId = post.originalPostParentId;
		}
		newPost.replyParentId = id;
		post.comments.push(newPost);
		await post.save();
		try {
			await newPost.save();
		} catch (error) {
			return res.status(409).json({ message: error.message });
		}

		return res.json(post);
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

const getComments = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		const post = await Post.findById(id)
			.populate("comments")
			.populate({
				path: "comments",
				populate: {
					path: "user",
					model: "User",
				},
			});
		res.json(post.comments);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	getPosts,
	getPostById,
	searchPosts,
	getPostsByAuthor,
	createPost,
	updatePost,
	deletePost,
	likePost,
	dislikePost,
	replyToPost,
	getComments,
};
