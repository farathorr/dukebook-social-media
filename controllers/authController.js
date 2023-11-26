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

// Update token user info
const update = async (req, res) => {
	const authHeader = req.headers?.authorization || req.headers?.Authorization;
	const token = authHeader?.split(" ")[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err || user.type !== "login") return res.sendStatus(403);
		try {
			const tableUser = await User.findById(user.userid);
			if (!user) return res.status(404).json({ message: `User ${userTag} not found.` });
			Object.keys(user).forEach((key) => {
				if (user[key]) tableUser[key] = user[key];
			});

			const accessToken = jwt.sign({ ...user, type: "login" }, process.env.ACCESS_TOKEN_SECRET);
			const refreshToken = jwt.sign({ ...user, type: "refresh" }, process.env.REFRESH_TOKEN_SECRET);
			await RefreshToken.deleteOne({ userid: user.userid });
			await RefreshToken.create({ userid: user.userid, token: refreshToken });
			const { iat, exp, ...userData } = user;
			res.status(200).json({ accessToken, refreshToken, user: userData });
		} catch (err) {
			res.status(404).json({ message: err.message });
		}
	});
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

module.exports = { login, update, refresh, logout };
