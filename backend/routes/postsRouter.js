const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();
const { optionalAuthentication, weakAuthentication } = require("../middleware/authenticateToken");

router.get("/", optionalAuthentication, postController.getPosts);
router.get("/:id", postController.getPostById);

router.get("/author/:userTag", postController.getPostsByAuthor);
router.post("/", weakAuthentication, postController.createPost);
router.patch("/:id", weakAuthentication, postController.updatePost);
router.delete("/:id", weakAuthentication, postController.deletePost);

router.put("/:id/like", weakAuthentication, postController.likePost);
router.put("/:id/dislike", weakAuthentication, postController.dislikePost);
router.patch("/:id/reply", weakAuthentication, postController.replyToPost);

router.get("/:id/replies", postController.getComments);
router.get("/:id/parents", postController.getParentPosts);

module.exports = router;
