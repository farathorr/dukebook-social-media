const express = require("express");
const messageController = require("../controllers/messageController");
const { weakAuthentication } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/group/:groupId", weakAuthentication, messageController.getMessages);
router.post("/group/:groupId", weakAuthentication, messageController.sendMessage);

router.get("/groups", weakAuthentication, messageController.getMessageGroups);
router.post("/groups", weakAuthentication, messageController.createMessageGroup);

module.exports = router;
