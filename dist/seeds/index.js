"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usersModel_1 = __importDefault(require("../database/models/usersModel"));
const blogsModel_1 = __importDefault(require("../database/models/blogsModel"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect("mongodb://localhost:27017/mybrand");
            console.log("Connected to database");
        }
        catch (err) {
            console.log("ERROR CONNECTING TO DATABASE");
            console.log(err);
        }
    });
})();
const blogs = [
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
const createBlog = function (blog) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield usersModel_1.default.findById("661f82878111b9937fa642ca");
            blog.slug = blog.title
                .replaceAll(/[*./:()?\n]/g, "")
                .split(" ")
                .join("_")
                .toLowerCase();
            const newBlog = new blogsModel_1.default(blog);
            newBlog.author = user;
            user.blogs.push(newBlog);
            yield user.save();
            yield newBlog.save();
        }
        catch (err) {
            console.error(err);
        }
    });
};
// createBlog(blog);
