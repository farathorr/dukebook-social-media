const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		min: 3,
		max: 20,
	},

  userTag: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 20,
  },

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

	profilePicture: {
		type: String,
		default: "",
	},

  profileDescription: {
    type: String,
    max: 200,
  },

	likedPosts: {
		type: Array,
		default: [],
	},

	dislikedPosts: {
		type: Array,
		default: [],
	},

	sharedPosts: {
		type: Array,
		default: [],
	},

	followerIds: {
		type: Array,
		default: [],
	},

	followedIds: {
		type: Array,
		default: [],
	},

  friendList : {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
