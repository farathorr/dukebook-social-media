const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

router.put("/:id/like", postController.likePost);
router.put("/:id/dislike", postController.dislikePost);
router.post("/:id/reply", postController.replyToPost);
router.get("/:id/replies", postController.getReplies);

module.exports = router;
