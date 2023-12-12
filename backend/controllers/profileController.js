const { User } = require("../models/users");

const getAuthUserInfo = async (req, res) => {
	const { userId } = req.user;
	const user = await User.findById(userId);
	return res.status(200).json(user);
};

const updateAuthUser = async (req, res) => {
	const { userId: id } = req.user;
	const { username, userTag, email, password, profilePicture, bio } = req.body;
	const updatedUser = { username, userTag, email, password, profilePicture, bio, _id: id };

	if (User.findOne(userTag)._id != req.user.id) return res.status(409).json({ message: "UserTag already exists." });

	const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

	if (!user) return res.status(404).send(`No user with id: ${id}`);

	res.status(200).json(updatedUser);
};

module.exports = {
	updateAuthUser,
	getAuthUserInfo,
};
