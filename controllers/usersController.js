const mongoose = require("mongoose");
const User = require("../models/users");
const bcrypt = require("bcrypt");

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
	const user = req.body;
	if (!user.userTag || !user.email || !user.password) {
		return res.status(400).json({ message: "Username, email, and password are required." });
	}

	const existingUsername = await User.findOne({ username: user.userTag });
	if (existingUsername) {
		return res.status(409).json({ message: "Usertag already exists." });
	}

	const existingEmail = await User.findOne({ email: user.email });
	if (existingEmail) {
		return res.status(409).json({ message: "Email already exists." });
	}

	const salt = await bcrypt.genSalt();
	user.username = user.userTag;
	user.password = await bcrypt.hash(user.password, salt);
	const newUser = new User(user);

	try {
		await newUser.save();
		res.status(201).json(newUser);
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
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No user with id: ${id}`);
	}
	await User.findByIdAndDelete(id);
	res.status(200).json({ message: "User deleted successfully." });
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
	const { followedUserTag } = req.params;
	const { followerUserTag } = req.body;
	try {
		console.log(`Followed User Tag: ${followedUserTag}`);
		console.log(`Follower User Tag: ${followerUserTag}`);

		const followedUser = await User.findOne({ userTag: followedUserTag });
		const followerUser = await User.findOne({ userTag: followerUserTag });

		console.log(`Followed User: ${followedUser}`);
		console.log(`Follower User: ${followerUser}`);
		if (!followedUser) return res.status(404).json({ message: `User ${followedUserTag} not found.` });
		if (!followerUser) return res.status(404).json({ message: `User ${followerUserTag} not found.` });

		followedUser.followerIds.push(followerUser._id);
		await followedUser.save();
		res.status(200).json(followedUser);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// unfollow user by userTag
const unfollowUser = async (req, res) => {
	const { followedUserTag } = req.params;
	const { followerUserTag } = req.body;
	try {
		const followedUser = await User.findOne({ userTag: followedUserTag });
		const followerUser = await User.findOne({ userTag: followerUserTag });

		if (!followedUser) return res.status(404).json({ message: `User ${followedUserTag} not found.` });
		if (!followerUser) return res.status(404).json({ message: `User ${followerUserTag} not found.` });

		await followedUser.followerIds.delete(followerUser._id);
		await followedUser.save();
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
	const { friendUserTag } = req.params;
	const { userTag } = req.body;
	try {
		const friendUser = await User.findOne({ userTag: friendUserTag });
		const user = await User.findOne({ userTag: userTag });

		if (!friendUser) return res.status(404).json({ message: `User ${friendUser} not found.` });
		if (!user) return res.status(404).json({ message: `User ${user} not found.` });

		await friendUser.friendList.push(user._id);
		await friendUser.save();
		res.status(200).json(friendUser);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// remove friend by userTag
const removeFriend = async (req, res) => {
	const { friendUserTag } = req.params;
	const { userTag } = req.body;
	try {
		const friendUser = await User.findOne({ userTag: friendUserTag });
		const user = await User.findOne({ userTag: userTag });

		if (!friendUser) return res.status(404).json({ message: `User ${friendUser} not found.` });
		if (!user) return res.status(404).json({ message: `User ${user} not found.` });

		await friendUser.friendList.delete(user._id);
		await friendUser.save();
		res.status(200).json(friendUser);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// check password
const checkPassword = async (req, res) => {
	const { userTag, password } = req.body;
	try {
		const user = await User.findOne({ userTag: userTag });
		if (!user) return res.status(404).json({ message: `User ${userTag} not found.` });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Invalid credentials.", isMatch: false });
		res.status(200).json({ message: "Login successful.", isMatch: true });
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
	checkPassword,
	getSensitiveData,
};
