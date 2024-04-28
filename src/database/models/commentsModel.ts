import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
