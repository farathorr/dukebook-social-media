const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	userTag: {
		type: String,
		required: true,
	},
	postText: {
		type: String,
		required: true,
		max: 500,
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
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
