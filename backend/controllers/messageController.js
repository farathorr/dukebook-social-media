const mongoose = require("mongoose");
const { User } = require("../models/users");
const { Message, MessageGroup } = require("../models/message");
const customFind = require("../utils/customFind");
const { socketIO } = require("../server");

const createMessageGroup = async (req, res) => {
	const { participants } = req.body;
	if (!participants) return res.status(400).json({ message: "Participants are required." });

	console.log(participants);

	try {
		const group = await MessageGroup.create({ participants });
		res.status(201).json(group);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getMessageGroups = async (req, res) => {
	const { userId } = req.user;

	try {
		const user = await User.findById(userId).populate({
			path: "messageGroups",
			populate: {
				path: "participants",
				select: "userTag username profilePicture",
			},
		});

		user.messageGroups.forEach((group) => {
			if (group.type == "chat") {
				const curUser = group.participants.find((user) => user._id != userId);
				group.userTag = curUser?.userTag ?? "Removed private chat";
				group.name = curUser?.username ?? "Removed private chat";
				group.image = curUser?.profilePicture;
			}
		});
		res.status(200).json(user.messageGroups);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};

const sendMessage = async (req, res) => {
	const { userId } = req.user;
	const { groupId, text } = req.body;
	if (!userId) return res.status(400).json({ message: "UserTag is required." });
	if (!groupId) return res.status(400).json({ message: "Message group is required." });
	if (!text) return res.status(400).json({ message: "Message text is required." });

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(400).json({ message: "User does not exist." });

		const group = await MessageGroup.findById(groupId);
		if (!group) return res.status(400).json({ message: "Message group does not exist." });

		const message = await Message.create({ sender: userId, text, groupId });
		await message.populate("sender", "userTag profilePicture");
		socketIO.emit(`message/${groupId}`, message);
		res.status(201).json(message);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getMessages = async (req, res) => {
	const { userId } = req.user;
	const { groupId } = req.query;
	if (!userId) return res.status(400).json({ message: "UserTag is required." });
	if (!groupId) return res.status(400).json({ message: "Message group is required." });

	try {
		const group = await MessageGroup.findById(groupId);
		if (!group?.participants.includes(userId)) return res.status(406).json({ message: "User doesn't belong to the group" });
		const messages = await Message.find({ groupId }).populate("sender").sort({ createdAt: 1 });
		res.status(200).json(messages);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { createMessageGroup, getMessageGroups, sendMessage, getMessages };
