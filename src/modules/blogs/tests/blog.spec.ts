import app from "../../../app";
// import { testImg } from "../../../constants";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import path from "path";
import fs from "fs";

let token, id, slug;
const imagePath = path.join(
  __dirname,
  "../../../../img/user-1714366525835.png"
);
const imageBuffer = fs.readFileSync(imagePath);

chai.use(chaiHttp);
const router = () => chai.request(app);
function registerAndLoginUser(callback: Function) {
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
    registerAndLoginUser((error: any, retrievedToken: string) => {
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
        longDescription:
          "htiwfutr djhgtrj gtrjgntr gtgunrtjgntrjntr gtjgntrugjntr",
        image:
          "https://media.istockphoto.com/id/537331500/photo/programming-code-abstract-technology-background-of-software-deve.jpg?s=612x612&w=0&k=20&c=jlYes8ZfnCmD0lLn-vKvzQoKXrWaEcVypHnB5MuO-g8=",
      })
      .end((error, response) => {
        expect(response.body).to.be.an("object").that.has.property("ok", false);
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
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("ok", true);
        expect(response.body).to.have.property("message");
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
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("ok", true);
        expect(response.body).to.have.property("message");
        expect(response.body.data).to.be.an("array");
        done(error);
      });
  });

  it("Should be able to delete created blog", (done) => {
    router()
      .delete(`/api/blogs/${slug}`)
      .set("Authorization", `Bearer ${token}`)
      .end((error, response) => {
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("ok", true);
        expect(response.body).to.have.property("message");
        done(error);
      });
  });
});
