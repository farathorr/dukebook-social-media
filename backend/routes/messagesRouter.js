const express = require("express");
const messageController = require("../controllers/messageController");
const { weakAuthentication } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/", weakAuthentication, messageController.getMessages);
router.post("/", weakAuthentication, messageController.sendMessage);

router.get("/groups", messageController.getMessageGroups);
router.post("/groups", messageController.createMessageGroup);

module.exports = router;
