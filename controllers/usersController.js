const mongoose = require("mongoose");
const { User, SensitiveData } = require("../models/users");
const Post = require("../models/posts");
const bcrypt = require("bcryptjs");
const { default: axios } = require("axios");

// get all users
const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// get user by id
const getUserById = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No user with id: ${id}`);
	}
	const user = await User.findById(id);
	res.status(200).json(user);
};

// get user by userTag
const getUserByUserTag = async (req, res) => {
	const { userTag } = req.params;
	const user = await User.findOne({ userTag: userTag });
	res.json(user);
};

// create user
const createUser = async (req, res) => {
	const { userTag, email, password } = req.body;

	if (!userTag || !email || !password) return res.status(400).json({ message: "Username, email, and password are required." });

	try {
		const existingName = await User.findOne({ userTag });
		if (existingName) return res.status(409).json({ message: "Username already exists." });

		const existingEmail = await SensitiveData.findOne({ email });
		if (existingEmail) return res.status(409).json({ message: "Email already exists." });

		const encryptedPassword = await bcrypt.hash(password, 10);
		const sensitiveData = new SensitiveData({ email, password: encryptedPassword });
		const user = new User({ userTag, username: userTag, sensitiveData });

		await user.save();
		await sensitiveData.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

// update user by id
const updateUser = async (req, res) => {
	const { id } = req.params;
	const { username, userTag, email, password, profilePicture, profileDescription } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No user with id: ${id}`);
	}
	const updatedUser = { username, userTag, email, password, profilePicture, profileDescription, _id: id };
	await User.findByIdAndUpdate(id, updatedUser, { new: true });
	res.status(200).json(updatedUser);
};

// delete user by id
const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		console.log("Deleting user with ID:", id);
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).send(`No user with id: ${id}`);
		}
		const user = await User.findById(id);

		if (!user) return res.status(404).json({ message: `User with id ${id} not found.` });
		await Post.deleteMany({ user: user._id });
		await User.findByIdAndDelete(id);
		await SensitiveData.findByIdAndDelete(user.sensitiveData);

		res.status(200).json({ message: "User and their posts deleted successfully." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// get followers by userTag
const getFollowers = async (req, res) => {
	const { userTag } = req.params;
	try {
		const user = await User.findOne({ userTag: userTag });
		if (!user) return res.status(404).json({ message: `User ${userTag} not found.` });
		const followers = await User.find({ _id: { $in: user.followerIds } });
		res.status(200).json(followers);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// get following by userTag
const getFollowing = async (req, res) => {
	const { userTag } = req.params;
	try {
		const user = await User.findOne({ userTag: userTag });
		if (!user) return res.status(404).json({ message: `User ${userTag} not found.` });
		const followed = await User.find({ _id: { $in: user.followedIds } });
		res.status(200).json(followed);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// follow user by userTag
const followUser = async (req, res) => {
	const { userTag: followedUserTag } = req.params;
	const { userId: followerUserId, userTag: followerUserTag } = req.user;
	try {
		console.log(`Followed User Tag: ${followedUserTag}`);
		console.log(`Follower User Tag: ${followerUserTag}`);

		const followedUser = await User.findOne({ userTag: followedUserTag });
		const followerUser = await User.findById(followerUserId);

		console.log(`Followed User: ${followedUser}`);
		console.log(`Follower User: ${followerUser}`);
		if (!followedUser) return res.status(404).json({ message: `User ${followedUserTag} not found.` });
		if (!followerUser) return res.status(404).json({ message: `User ${followerUserTag} not found.` });

		if (followedUser.followerIds.some((id) => id.toString() === followerUser._id.toString())) {
			return res.status(404).json({ message: `User ${followerUserTag} is already following user ${followedUserTag}.` });
		}

		followedUser.followerIds.push(followerUser._id);
		followerUser.followedIds.push(followedUser._id);
		followedUser.save();
		followerUser.save();
		res.status(200).json(followedUser);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// unfollow user by userTag
const unfollowUser = async (req, res) => {
	const { userTag: followedUserTag } = req.params;
	const { userId: followerUserId, userTag: followerUserTag } = req.user;
	try {
		const followedUser = await User.findOne({ userTag: followedUserTag });
		const followerUser = await User.findById(followerUserId);

		if (!followedUser) return res.status(404).json({ message: `User ${followedUserTag} not found.` });
		if (!followerUser) return res.status(404).json({ message: `User ${followerUserTag} not found.` });

		if (!followedUser.followerIds.some((id) => id.toString() === followerUser._id.toString())) {
			return res.status(404).json({ message: `User ${followerUserTag} is not following user ${followedUserTag}.` });
		}
		await followedUser.followerIds.pull(followerUser._id);
		followerUser.followedIds.pull(followedUser._id);
		followedUser.save();
		followerUser.save();
		res.status(200).json(followedUser);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

//get friends by userTag
const getFriends = async (req, res) => {
	const { userTag } = req.params;
	try {
		const user = await User.findOne({ userTag: userTag });
		if (!user) return res.status(404).json({ message: `User ${userTag} not found.` });
		const friends = await User.find({ _id: { $in: user.friendList } });
		res.status(200).json(friends);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// add friend by userTag
const addFriend = async (req, res) => {
	const { userTag: friendUserTag } = req.params;
	const { userId } = req.user;
	try {
		const friendUser = await User.findOne({ userTag: friendUserTag });
		const user = await User.findById(userId);

		if (!friendUser) return res.status(404).json({ message: `User ${friendUser} not found.` });
		if (!user) return res.status(404).json({ message: `User ${user} not found.` });

		if (user.friendList.some((id) => id.toString() === friendUser._id.toString())) {
			return res.status(404).json({ message: `User ${req.user.userTag} is already friends with user ${friendUserTag}.` });
		}
		user.friendList.push(friendUser._id);
		await user.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// remove friend by userTag
const removeFriend = async (req, res) => {
	const { userTag: friendUserTag } = req.params;
	const { userId } = req.user;
	try {
		const friendUser = await User.findOne({ userTag: friendUserTag });
		const user = await User.findById(userId);

		if (!friendUser) return res.status(404).json({ message: `User ${friendUser} not found.` });
		if (!user) return res.status(404).json({ message: `User ${user} not found.` });

		if (!user.friendList.some((id) => id.toString() === friendUser._id.toString())) {
			return res.status(404).json({ message: `User ${req.user.userTag} is not friends with user ${friendUserTag}.` });
		}

		await user.friendList.pull(friendUser._id);
		await user.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// get sensitive data (TESTING, can be removed leter)
const getSensitiveData = async (req, res) => {
	const user = req.user;
	res.status(200).json({ message: `You have access to "${user.userTag}" sensitive data.` });
};

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getFollowers,
	getFollowing,
	followUser,
	unfollowUser,
	getFriends,
	addFriend,
	removeFriend,
	getUserByUserTag,
	getSensitiveData,
};
