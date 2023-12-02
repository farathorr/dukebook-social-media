const express = require("express");
const usersController = require("../controllers/usersController");
const { weakAuthentication, strongAuthentication } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);

router.get("/:id", usersController.getUserById);
router.patch("/:id", usersController.updateUserById);
router.delete("/:id", usersController.deleteUserById);

router.get("/userTag/:userTag", usersController.getUserByUserTag);

router.get("/followers/:userTag", usersController.getFollowersByUserTag);
router.get("/following/:userTag", usersController.getFollowingByUserTag);
router.put("/follow/:userTag", weakAuthentication, usersController.followUserByUserTag);
router.put("/unfollow/:userTag", weakAuthentication, usersController.unfollowUserByUserTag);

router.get("/friends/:userTag", usersController.getFriendsByUserTag);
router.put("/addFriend/:userTag", weakAuthentication, usersController.addFriendByUserTag);
router.put("/removeFriend/:userTag", weakAuthentication, usersController.removeFriendByUserTag);

module.exports = router;
