const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

router.put("/:id/follow", usersController.followUser);
router.put("/:id/unfollow", usersController.unfollowUser);
router.put("/:id/followers", usersController.getFollowers);
router.put("/:id/following", usersController.getFollowing);

router.put("/:id/friends", usersController.getFriends);
router.put("/:id/addFriend", usersController.addFriend);
router.put("/:id/removeFriend", usersController.removeFriend);

module.exports = router;
