import mongoose from "mongoose";
const { Schema } = mongoose;

const contactSchema = new Schema({
  fullname: { type: String, trim: true },
  email: {
    type: String,
    //  unique: true,
    trim: true,
    lowercase: true,
  },
  subject: { type: String, trim: true },
  message: { type: String, trim: true },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
