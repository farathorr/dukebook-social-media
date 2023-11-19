const mongoose = require("mongoose");
const User = require("../models/users");

// get all users
const getUsers = async (req, res) => {
	const users = await users.find();
	res.json(users);
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

// create user
const createUser = async (req, res) => {
	const user = req.body;
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
	const { username, email, password, profilePicture, profileDescription } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No user with id: ${id}`);
	}
	const updatedUser = { username, email, password, profilePicture, profileDescription, _id: id };
	await User.findByIdAndUpdate(id, updatedUser, { new: true });
	res.status(200).json(updatedUser);
};

// delete user by id

const deleteUser = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send(`No user with id: ${id}`);
	}
	await User.findByIdAndRemove(id);
	res.status(200).json({ message: "User deleted successfully." });
};

// follow user by id
const followUser = async (req, res) => {
	const { followedId } = req.params;
	const { followerId } = req.body;
	if (!mongoose.Types.ObjectId.isValid(followedId)) {
		return res.status(404).send(`No user with id: ${followedId}`);
	}
	if (!mongoose.Types.ObjectId.isValid(followerId)) {
		return res.status(404).send(`No user with id: ${followerId}`);
	}
	const followedUser = await User.findById(followedId);
	followedUser.followerIds.push(followerId);
	await followedUser.save();
	res.status(200).json(followedUser);
};

// unfollow user by id

const unfollowUser = async (req, res) => {
	const { followedId } = req.params;
	const { followerId } = req.body;
	if (!mongoose.Types.ObjectId.isValid(followedId)) {
		return res.status(404).send(`No user with id: ${followedId}`);
	}
	if (!mongoose.Types.ObjectId.isValid(followerId)) {
		return res.status(404).send(`No user with id: ${followerId}`);
	}
	const followedUser = await User.findById(followedId);
	followedUser.followerIds.pull(followerId);
	await followedUser.save();
	res.status(200).json(followedUser);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
};
