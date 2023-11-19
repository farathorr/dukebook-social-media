const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  postText: {
    type: String,
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
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;