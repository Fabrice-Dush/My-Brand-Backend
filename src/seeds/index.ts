import mongoose from "mongoose";
import User from "../database/models/usersModel";
import Blog from "../database/models/blogsModel";

(async function () {
  try {
    await mongoose.connect("mongodb://localhost:27017/mybrand");
    console.log("Connected to database");
  } catch (err) {
    console.log("ERROR CONNECTING TO DATABASE");
    console.log(err);
  }
})();

const blogs: any[] = [
  {
    image: "/img/deno.webp",
    title: "Deno vs. Node.js vs Bun: Full Comparison Guide",
    description: `Not sure which of these runtimes to use in your new project or if it's worth migrating? There's a clear winner in the deno vs node debate. Could bun overthrow both? We break down the pros + cons of each so you can decide which to use or learn.`,
    longDescription: `Until about 5 years ago, almost all of America's nuclear arsenal was run on giant IBM 1 floppy disks.
Some claim it was because it couldn’t be hacked, but a prevailing theory is that it was just a hassle to move everything across to a new system.
Node.js is lightweight and ideal for data-intensive, scalable, and real-time web apps that run on distributed platforms - in part due to its event-driven architecture and async I/O functions.
Created in 2009 by Ryan Dahl, Node.js is an open-source, cross-platform JavaScript runtime environment.
Built on the V8 JavaScript engine, Node executes JavaScript code outside a web browser and allows devs to write command line tools and run event-driven server-side scripts.`,
    readMinutes: 21,
  },
];

const createBlog = async function (blog: any) {
  try {
    const user = await User.findById("661f82878111b9937fa642ca");
    blog.slug = blog.title
      .replaceAll(/[*./:()?\n]/g, "")
      .split(" ")
      .join("_")
      .toLowerCase();
    const newBlog: any = new Blog(blog);
    newBlog.author = user;
    user.blogs.push(newBlog);
    await user.save();
    await newBlog.save();
  } catch (err) {
    console.error(err);
  }
};
// createBlog(blog);
