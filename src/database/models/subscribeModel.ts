import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
});

const Subscribe = mongoose.model("Subscribe", subscribeSchema);

export default Subscribe;
