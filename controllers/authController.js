const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/users");
const RefreshToken = require("../models/refreshToken");

// Generate access token
const login = async (req, res) => {
	const { userTag, password } = req.body;
	try {
		const user = await User.findOne({ userTag }).populate("sensitiveData");
		if (!user) return res.status(404).json({ message: `User ${userTag} not found.` });
		
		const correctPassword = await bcrypt.compare(password, user.sensitiveData.password);
		if (!correctPassword) return res.status(400).json({ message: "Invalid credentials.", isMatch: false });

		const tokenUser = { userid: user._id, type: "login", userTag: user.userTag, username: user.username };

		const accessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
		const refreshToken = jwt.sign({ ...tokenUser, type: "refresh" }, process.env.REFRESH_TOKEN_SECRET);
		await RefreshToken.deleteOne({ userid: user._id });
		await RefreshToken.create({ userid: user._id, token: refreshToken });
		res.status(200).json({ accessToken, refreshToken, user: tokenUser });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// Refresh access token
const refresh = async (req, res) => {
	const refreshToken = req.body?.token;
	if (!refreshToken) return res.sendStatus(401);
	try {
		const validToken = await RefreshToken.findOne({ token: refreshToken });
		if (!validToken) return res.sendStatus(403);

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, { iat, ...user }) => {
			if (err) return res.sendStatus(403);
			const tokenUser = { ...user, type: "refresh" };
			const accessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
			res.status(200).json({ accessToken: accessToken, user });
		});
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

// Logout and remove refresh token from database
const logout = async (req, res) => {
	const refreshToken = req.body?.token;
	if (!refreshToken) return res.sendStatus(401);
	try {
		await RefreshToken.deleteOne({ token: refreshToken });
		res.sendStatus(200);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

module.exports = { login, refresh, logout };
