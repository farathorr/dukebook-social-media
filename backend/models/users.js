const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		userTag: {
			type: String,
			required: true,
			unique: true,
			min: 3,
			max: 20,
		},
		sensitiveData: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SensitiveData",
		},
		username: {
			type: String,
			unique: true,
			min: 3,
			max: 20,
		},
		profilePicture: {
			type: String,
			default: "",
		},
		profileDescription: {
			type: String,
			max: 200,
		},
		likedPosts: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Post",
				},
			],
			default: [],
		},
		dislikedPosts: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Post",
				},
			],
			default: [],
		},
		sharedPosts: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Post",
				},
			],
			default: [],
		},
		followerIds: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
			default: [],
		},
		followedIds: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
			default: [],
		},
		friendList: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
			default: [],
		},
		bio: {
			type: String,
			max: 500,
		},
	},
	{ timestamps: true }
);

const sensitiveDataSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		max: 50,
	},
	password: {
		type: String,
		required: true,
		min: 6,
	},
});

const SensitiveData = mongoose.model("SensitiveData", sensitiveDataSchema);

const User = mongoose.model("User", userSchema);

module.exports = { User, SensitiveData };
