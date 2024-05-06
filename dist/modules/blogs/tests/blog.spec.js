"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../../app"));
// import { testImg } from "../../../constants";
const chai_http_1 = __importDefault(require("chai-http"));
const chai_1 = __importStar(require("chai"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let token, id, slug;
const imagePath = path_1.default.join(__dirname, "../../../../img/user-1714366525835.png");
const imageBuffer = fs_1.default.readFileSync(imagePath);
chai_1.default.use(chai_http_1.default);
const router = () => chai_1.default.request(app_1.default);
function registerAndLoginUser(callback) {
    router()
        .post("/api/signup")
        .send({
        fullname: "TestUser",
        email: "datchguest@gmail.com",
        password: "PasswordForUser@123",
    })
        .end((error, response) => {
        if (error) {
            return callback(error);
        }
        token = response.body.token;
        id = response.body.data._id;
        console.log("Found id: ", id);
        callback(null, token);
        // router()
        //   .post("/api/login")
        //   .send({
        //     email: "datchguest@gmail.com",
        //     password: "PasswordForUser@123",
        //   })
        //   .end((error, response) => {
        //     if (error) {
        //       return callback(error);
        //     }
        //     token = response.body.token;
        //     id = response.body.data._id;
        //     callback(null, token);
        //   });
    });
}
describe("Blog Test Cases", () => {
    let createdBlogId = "";
    let createdTodo = {};
    const fakeId = "609d2071278a0914dca23b99";
    before(function (done) {
        registerAndLoginUser((error, retrievedToken) => {
            if (error) {
                return done(error);
            }
            token = retrievedToken;
            done();
        });
    });
    after(function (done) {
        router()
            .delete(`/api/users/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((error, response) => {
            done();
        });
    });
    it("Should not be able to add blog without login token", (done) => {
        router()
            .post("/api/blogs/")
            .set("Authorization", "Bearer idiuddvjnfjvnjvnvjnfvfvn")
            .send({
            title: "Blog Title",
            description: "Blog description",
            longDescription: "htiwfutr djhgtrj gtrjgntr gtgunrtjgntrjntr gtjgntrugjntr",
            image: "https://media.istockphoto.com/id/537331500/photo/programming-code-abstract-technology-background-of-software-deve.jpg?s=612x612&w=0&k=20&c=jlYes8ZfnCmD0lLn-vKvzQoKXrWaEcVypHnB5MuO-g8=",
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.body).to.be.an("object").that.has.property("ok", false);
            done(error);
        });
    });
    it("Should be able to add new Blog", (done) => {
        router()
            .post("/api/blogs/post")
            .field("title", "Why coding sucks")
            .field("description", "i hate testing")
            .field("longDescription", "jrfejrgntjgnjtrgnutgn")
            .attach("image", imageBuffer, "user-1714366525835.png")
            .set("Authorization", `Bearer ${token}`)
            // .send({
            //   title: "Blog Title",
            //   description: "Blog description",
            //   longDescription:
            //     "htiwfutr djhgtrj gtrjgntr gtgunrtjgntrjntr gtjgntrugjntr",
            //   // image: "../../../../img/user-1714366525835.png",
            // })
            .end((error, response) => {
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("ok", true);
            (0, chai_1.expect)(response.body).to.have.property("message");
            // createdBlogId = response.body.data._id;
            slug = response.body.slug;
            console.log("slug: ", slug);
            done(error);
        });
    });
    it("Should be able to get all blogs", (done) => {
        router()
            .get("/api/blogs/")
            .end((error, response) => {
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("ok", true);
            (0, chai_1.expect)(response.body).to.have.property("message");
            (0, chai_1.expect)(response.body.data).to.be.an("array");
            done(error);
        });
    });
    it("Should be able to delete created blog", (done) => {
        router()
            .delete(`/api/blogs/${slug}`)
            .set("Authorization", `Bearer ${token}`)
            .end((error, response) => {
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("ok", true);
            (0, chai_1.expect)(response.body).to.have.property("message");
            done(error);
        });
    });
});
