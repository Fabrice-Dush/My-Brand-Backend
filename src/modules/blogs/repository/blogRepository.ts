import Blog from "./../../../database/models/blogsModel";

export const getAllBlogs = async function () {
  return await Blog.find().populate("author");
};

export const getSampleBlog = async function (slug: string) {
  return await Blog.findOne({ slug });
};

export const getBlogById = async function (id) {
  return await Blog.findById(id)
    .populate("author")
    .populate({ path: "comments", populate: { path: "author" } })
    .populate({ path: "likes", populate: { path: "owner" } });
};

export const getOneBlog = async function (slug: string) {
  return await Blog.findOne({ slug })
    .populate("author")
    .populate({
      path: "likes",
      populate: { path: "owner" },
    })
    .populate({ path: "comments", populate: { path: "author" } });
};

export const updateBlogBySlug = async function (slug, id) {
  return await Blog.findOneAndUpdate(
    { slug },
    { $pull: { comments: id } },
    { new: true, runValidators: true }
  );
};

export const updateOneBlog = async function (
  slug: string,
  data,
  imagePath: string
) {
  return await Blog.findOneAndUpdate(
    { slug },
    {
      ...data,
      slug: data.title
        .replaceAll(/[*\./:()?!\n]/g, "")
        .split(" ")
        .join("_")
        .toLowerCase(),
      image: imagePath,
    },
    { new: true, runValidators: true }
  );
};

export const deleteOneBlog = async function (slug: string) {
  return await Blog.findOneAndDelete({ slug });
};
