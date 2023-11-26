const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.get("/author/:userTag", postController.getPostsByAuthor);
router.post("/", postController.createPost);
router.patch("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
//
router.put("/:id/like", postController.likePost);
router.put("/:id/dislike", postController.dislikePost);
router.patch("/:id/reply", postController.replyToPost);
router.get("/:id/replies", postController.getComments);

module.exports = router;
