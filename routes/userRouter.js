const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteProfile);

router.put("/:id/follow", usersController.followProfile);
router.put("/:id/unfollow", usersController.unfollowProfile);



module.exports = router;