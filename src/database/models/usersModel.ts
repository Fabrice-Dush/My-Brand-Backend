import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Blog from "./blogsModel";
import Like from "./likesModel";
import Comment from "./commentsModel";
const { Schema } = mongoose;
const { isEmail } = validator;

const userSchema = new Schema({
  OTP: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    trim: true,
    minlength: 8,
  },
  email: {
    type: String,
    validate: isEmail,
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.post("findOneAndDelete", async function (user) {
  console.log(user);

  await Blog.deleteMany({ _id: { $in: user.blogs } });
  await Like.deleteMany({ owner: user._id });
  await Comment.deleteMany({ author: user._id });
});

export const loginStatic = async function (email: string, password: string) {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("You don't have an account yet");
    const isTrue = await bcrypt.compare(password, user.password);
    // const isTrue = password === user.password;
    if (!isTrue) throw new Error("Wrong password");
    return user;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
