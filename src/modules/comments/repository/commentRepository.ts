import Comment from "../../../database/models/commentsModel";

export const deleteCommentById = async function (id) {
  return await Comment.findByIdAndDelete(id);
};
