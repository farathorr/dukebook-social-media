const posts = require("../models_old/posts");
const users = require("../models_old/users");

const getPosts = (req, res) => {
	res.json(posts);
};

const getPostById = (req, res) => {
	const post = posts.find((post) => post.id === parseInt(req.params.id));
	if (!post) {
		res.status(404).json({ message: `Post ${req.params.id} not found.` });
	} else {
		res.json(post);
	}
};

const createPost = (req, res) => {
	const basePost = {
		parentId: null,
		tags: [],
		likes: 0,
		dislikes: 0,
		replies: [],
	};
	const post = req.body;
	if (!post.body || !post.author) {
		res.status(400).json({ message: "Body and author are required." });
	} else {
		post.id = posts.reduce((acc, post) => Math.max(acc, post.id), 0) + 1;
		posts.push({ ...basePost, ...post });
		res.status(201).json(post);
	}
};

const updatePost = (req, res) => {
	const post = posts.find((post) => post.id === parseInt(req.params.id));
	if (!post) {
		res.status(404).json({ message: `Post ${req.params.id} not found.` });
	} else {
		const updatedPost = req.body;
		if (!updatedPost.body) {
			res.status(400).json({ message: "Body is required." });
		} else {
			post.body = updatedPost.body;
			res.json(post);
		}
	}
};

const deletePost = (req, res) => {
	const post = posts.find((post) => post.id === parseInt(req.params.id));
	if (!post) {
		res.status(404).json({ message: `Post ${req.params.id} not found.` });
	} else {
		const index = posts.indexOf(post);
		posts.splice(index, 1);
		res.json(post);
	}
};

const likePost = (req, res) => {
	if (!req.body.userId) {
		res.status(400).json({ message: "User ID is required." });
		return;
	}
	const user = users.find((user) => user.id === parseInt(req.body.userId));
	const post = posts.find((post) => post.id === parseInt(req.params.id));
	const hasLiked = user.likedPosts.some((id) => id === post.id);
	if (!user) {
		res.status(404).json({ message: `User ${req.body.userId} not found.` });
	} else if (!post) {
		res.status(404).json({ message: `Post ${req.params.id} not found.` });
	} else if (!hasLiked) {
		post.likes++;
		user.likedPosts.push(post.id);
		res.json(post);
	} else {
		res.status(400).json({ message: `User ${user.id} has already liked post ${post.id}.` });
	}
};

const dislikePost = (req, res) => {
	if (!req.body.userId) {
		res.status(400).json({ message: "User ID is required." });
		return;
	}

	const user = users.find((user) => user.id === parseInt(req.body.userId));
	const post = posts.find((post) => post.id === parseInt(req.params.id));
	const hasDisliked = user.dislikedPosts.some((id) => id === post.id);
	if (!user) {
		res.status(404).json({ message: `User ${req.body.userId} not found.` });
	} else if (!post) {
		res.status(404).json({ message: `Post ${req.params.id} not found.` });
	} else if (!hasDisliked) {
		post.dislikes++;
		user.dislikedPosts.push(post.id);
		res.json(post);
	} else {
		res.status(400).json({ message: `User ${user.id} has already disliked post ${post.id}.` });
	}
};

const getReplies = (req, res) => {
	const post = posts.find((post) => post.id === parseInt(req.params.id));
	if (!post) {
		res.status(404).json({ message: `Post ${req.params.id} not found.` });
	} else {
		const replies = [];
		post.replies.forEach((id) => {
			const reply = posts.find((post) => post.id === id);
			if (reply) replies.push(reply);
		});

		res.json(replies);
	}
};

const replyToPost = (req, res) => {
	const post = posts.find((post) => post.id === parseInt(req.params.id));
	const basePost = {
		parentId: null,
		tags: [],
		likes: 0,
		dislikes: 0,
		replies: [],
	};

	if (!post) {
		res.status(404).json({ message: `Post ${req.params.id} not found.` });
		return;
	}

	if (!req.body.body || !req.body.author) {
		res.status(400).json({ message: "Body and author are required." });
	} else {
		const id = posts.reduce((acc, post) => Math.max(acc, post.id), 0) + 1;
		post.replies.push(id);
		posts.push({ ...basePost, ...req.body, id, parentId: post.id });
		res.status(201).json(post);
	}
};

module.exports = {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
	likePost,
	dislikePost,
	getReplies,
	replyToPost,
};
