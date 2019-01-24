const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BlogSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  catrgories: [
    {
      type: [String],
      required: true
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Blog = mongoose.model("blogs", BlogSchema);
