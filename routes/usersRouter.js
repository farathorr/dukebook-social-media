const express = require("express");
const usersController = require("../controllers/usersController");
const { weakAuthentication, strongAuthentication } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.get("/userTag/:userTag", usersController.getUserByUserTag);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

router.put("/follow/:userTag", usersController.followUser);
router.put("/unfollow/:userTag", usersController.unfollowUser);
router.get("/followers/:userTag", usersController.getFollowers);
router.get("/following/:userTag", usersController.getFollowing);

router.get("/friends/:userTag", usersController.getFriends);
router.put("/addFriend/:userTag", usersController.addFriend);
router.put("/removeFriend/:userTag", usersController.removeFriend);

// router.post("/login", usersController.checkPassword);
router.post("/getSensitiveData", weakAuthentication, usersController.getSensitiveData);
router.post("/getSensitiveData2", strongAuthentication, usersController.getSensitiveData);

module.exports = router;
