const express = require("express");
const profileController = require("../controllers/profileController");
const router = express.Router();
const { weakAuthentication, strongAuthentication } = require("../middleware/authenticateToken");

router.get("/", weakAuthentication, profileController.getAuthUserInfo);
router.patch("/", strongAuthentication, profileController.updateAuthUser);

module.exports = router;
