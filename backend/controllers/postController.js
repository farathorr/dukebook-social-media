const mongoose = require("mongoose");
const Post = require("../models/posts");
const { User } = require("../models/users");
const { socketIO } = require("../server");

// get all posts
const getPosts = async (req, res) => {
	const { filter, search } = req.query;
	const userId = req.user?.userId;

	const options = { search, isOriginalPost: true };
	if (userId) {
		const user = await User.findById(userId);
		if (filter?.includes("followed")) options.followedByUser = user;
		if (filter?.includes("friends")) options.friendsWithUser = user;
	}

	try {
		const posts = await customFind(Post, options).populate("user");
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

function customFind(schema, { limit, _id, search, isComment, isOriginalPost, followedByUser, friendsWithUser, ...query }) {
	const find = [{}];
	const sort = { createdAt: -1, _id: 1 };
	limit ??= 100;

	try {
		if (_id) return schema.findById(_id);

		if (search) {
			const wordCount = search.split(" ").length;
			find[0].removed = false;

			if (wordCount < 2) find[0].postText = { $regex: search, $options: "i" };
			else {
				find[0].$text = { $search: search };
				find.push({ score: { $meta: "textScore" } });
				sort.score = { $meta: "textScore" };
			}
		}

		if (isComment) find[0].nestingLevel = { $gt: 0 };
		else if (isOriginalPost) find[0].nestingLevel = 0;

		if (followedByUser || friendsWithUser) find[0].$and = [];
		if (followedByUser) find[0].$and.push({ user: { $in: followedByUser.followedIds } });
		if (friendsWithUser) find[0].$and.push({ user: { $in: friendsWithUser.friendList } });

		return schema
			.find(...find)
			.sort(sort)
			.limit(limit);
	} catch (err) {
		console.log(err);
		return err;
	}
}

module.exports = {
	getPosts,
	getPostById,
	getPostsByAuthor,
	createPost,
	updatePost,
	deletePost,
	getParentPosts,
	likePost,
	dislikePost,
	replyToPost,
	getComments,
};
