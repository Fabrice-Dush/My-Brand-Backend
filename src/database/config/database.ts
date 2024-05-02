import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

(async function () {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to database");
  } catch (err) {
    console.log("ERROR CONNECTING TO DATABASE");
    console.log(err);
  }
})();
