import mongoose from "mongoose";
const { Schema } = mongoose;

const likeSchema = new Schema({
  likeCount: Number,
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Like = mongoose.model("Like", likeSchema);
export default Like;
