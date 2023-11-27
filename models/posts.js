const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		postText: {
			type: String,
			required: true,
			max: 500,
			index: "text",
		},
		image: {
			type: String,
		},
		likes: {
			type: Array,
			default: [],
		},
		dislikes: {
			type: Array,
			default: [],
		},
		comments: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Post",
				},
			],
			default: [],
		},
		originalPostParentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		replyParentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
