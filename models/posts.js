const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  postText: {
    type: String,
    required: true,
    max: 500,
  },

  image: {
    type: String,
  },

  likes: {
    type: Array,
    default: [],
  },

  dislikes: {
    type: Array,
    default: [],
  },

  comments: {
    type: Array,
    default: [],
  },

  originalReplyParentId: {
    type: String,
  },

  replyParentId: {
    type: String,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;