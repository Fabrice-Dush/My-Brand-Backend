import mongoose from "mongoose";
import Like from "./likesModel";
import Comment from "./commentsModel";
import User from "./usersModel";
const { Schema } = mongoose;

const blogSchema = new Schema({
  isAccepted: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: [true, "A blog should have an image"],
    lowercase: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, "A blog should have a title"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "A blog should have a description"],
    trim: true,
  },
  longDescription: String,
  date: {
    type: String,
    default: new Date().toDateString(),
  },

  tags: {
    type: String,
    enum: [
      "Web Development",
      "Software Development",
      "Frontend Development",
      "Backend Development",
    ],
    default: "Web Development",
  },
  readMinutes: {
    type: Number,
    default: 15,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  slug: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

blogSchema.post("findOneAndDelete", async function (blog) {
  try {
    const deletedLikes = await Like.deleteMany({ _id: { $in: blog.likes } });
    const deletedComments = await Comment.deleteMany({
      _id: { $in: blog.comments },
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: blog.author._id },
      { $pull: { blogs: blog._id } },
      { new: true, runValidators: true }
    );
    console.log("DeletedLikes: ", deletedLikes);
    console.log("DeletedComments: ", deletedComments);
    console.log("Updateduser: ", updatedUser);
  } catch (err) {
    console.error("Error Stuck in deletion: ", err);
  }
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
