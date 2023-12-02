const mongoose = require("mongoose");
const Post = require("../models/posts");
const { User } = require("../models/users");
const { socketIO } = require("../server");

// get all posts
const getPosts = async (req, res) => {
	try {
		const posts = await Post.find({ originalPostParentId: { $exists: false } })
			.sort({ createdAt: -1, _id: 1 })
			.limit(100)
			.populate("user");
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
			const posts = await Post.find({ $text: { $search: search } }, { score: { $meta: "textScore" } })
				.sort({
					score: { $meta: "textScore" },
					createdAt: -1,
					_id: 1,
				})
				.limit(100)
				.populate("user");
			return res.json(posts);
		} else {
			const posts = await Post.find({ postText: { $regex: search, $options: "i" } })
				.sort({
					createdAt: -1,
					_id: 1,
				})
				.limit(100)
				.populate("user");
			return res.json(posts);
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

//get posts by userTag
const getPostsByAuthor = async (req, res) => {
	const { userTag } = req.params;
	try {
		const user = await User.findOne({ userTag });
		if (!user) return res.status(400).json({ message: "User does not exist." });
		const posts = await Post.find({ user: user._id });
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// create post
const createPost = async (req, res) => {
	const { userId } = req.user;
	const { postText } = req.body;
	if (!userId) return res.status(400).json({ message: "UserTag is required." });
	if (!postText) return res.status(400).json({ message: "Post text is required." });

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(400).json({ message: "User does not exist." });
		try {
			const newPost = new Post({ postText, user });
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
	const { postText } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		const updatedPost = await Post.findByIdAndUpdate(id, { postText }, { new: true });
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
		const post = await Post.findByIdAndUpdate(id, { user: null, postText: "Post removed", removed: true }).populate("replyParentId");
		const parent = post.replyParentId;
		if (!post.comments?.length) {
			await Post.findByIdAndDelete(id);

			if (parent) {
				parent.comments.pull(id);
				parent.save();
				socketIO.emit("post/" + parent._id, { comments: parent.comments.length });
			}
		}

		res.json({ message: "Post deleted successfully." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const likePost = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.user;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		const post = await Post.findById(id);
		if (post.likes.includes(userId)) {
			post.likes.pull(userId);
		} else {
			post.dislikes.pull(userId);
			post.likes.push(userId);
		}

		post.save();
		socketIO.emit("post/" + id, { likes: post.likes.length, dislikes: post.dislikes.length });
		res.json(post);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const dislikePost = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.user;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}
	try {
		const post = await Post.findById(id);
		if (post.dislikes.includes(userId)) {
			post.dislikes.pull(userId);
		} else {
			post.likes.pull(userId);
			post.dislikes.push(userId);
		}

		post.save();
		socketIO.emit("post/" + id, { likes: post.likes.length, dislikes: post.dislikes.length });
		res.json(post);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const replyToPost = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.user;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No post with id: ${id}`);
	}

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(400).json({ message: "User does not exist." });
		const post = await Post.findById(id);
		const newPost = new Post({ ...req.body, user });
		newPost.originalPostParentId = post.originalPostParentId ?? id;
		newPost.replyParentId = id;
		newPost.nestingLevel = post.nestingLevel + 1;
		post.comments.push(newPost);
		await post.save();
		socketIO.emit("post/" + id, { comments: post.comments.length });
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
	const nestingLevel = Math.min(Math.max(req.query?.nesting ?? 0, 0), 10);
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	try {
		const nesting = deepPopulate(nestingLevel, {});

		function deepPopulate(nesting, value) {
			Object.assign(value, { path: "comments", model: "Post", populate: [{ path: "user", model: "User" }] });
			if (--nesting <= 0) return value;
			value.populate.push({});
			deepPopulate(nesting, value.populate.at(-1));

			return value;
		}

		const post = await Post.findById(id).populate(nesting);
		res.json(post.comments);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getFilteredPosts = async (req, res) => {
	const { filter } = req.params;
	const { userId } = req.user;
	if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send(`No user with id: ${userId}`);
	const user = await User.findById(userId);
	try {
		if (filter === "followed") {
			user.populate("followedIds");
			let posts = await Post.find({ user: { $in: user.followedIds }, nestingLevel: 0 })
				.sort({ createdAt: -1, _id: 1 })
				.populate("user");
			res.json(posts);
		}
		if (filter === "friends") {
			console.log("FRIENDS", user.friendList);
			user.populate("friendList");
			let posts = await Post.find({ user: { $in: user.friendList }, nestingLevel: 0 })
				.sort({ createdAt: -1, _id: 1 })
				.populate("user");

			res.json(posts);
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getParentPosts = async (req, res) => {
	const nestingLevel = Math.min(Math.max(req.query?.nesting ?? 0, 0), 10);
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	try {
		const nesting = deepPopulate(nestingLevel, {});

		function deepPopulate(nesting, value) {
			Object.assign(value, { path: "replyParentId", model: "Post", populate: [{ path: "user", model: "User" }] });
			if (--nesting <= 0) return value;
			value.populate.push({});
			deepPopulate(nesting, value.populate.at(-1));

			return value;
		}

		const post = await Post.findById(id).populate(nesting).populate("user");
		const parentArray = [];
		removeNesting(post);

		function removeNesting(parent) {
			parentArray.unshift(parent);
			if (parent.replyParentId?.comments) {
				removeNesting(parent.replyParentId);
				parent.replyParentId = parent.replyParentId._id;
			}
		}

		res.status(200).json(parentArray);
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
	getParentPosts,
	likePost,
	dislikePost,
	replyToPost,
	getComments,
	getFilteredPosts,
};
