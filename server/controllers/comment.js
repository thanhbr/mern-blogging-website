import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { commentRepository } from "../repositories/index.js";

const create = async (req, res) => {
  try {
    const user_id = req.user;
    const {_id, comment, blog_author, replying_to} = req.body;

    const result = await commentRepository.createComment({ _id, user_id, commentReq: comment, blog_author, replying_to });
    return res.status(HttpStatusCode.OK).json({
      status: !!result?._id,
      message: `Add comment ${!!result?._id ? "successfully" : "failed"}`,
      data: result
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const getBlogComments = async (req, res) => {
  try {
    const { blog_id, skip } = req.body;

    const result = await commentRepository.getBlogComments({ blog_id, skip });
    return res.status(HttpStatusCode.OK).json({
      status: !!result?.length,
      message: `Get comments ${result?.length ? "successfully" : "failed"}`,
      data: result
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const getReplies = async (req, res) => {
  try {
    const { _id, skip } = req.body;

    const result = await commentRepository.getReplies({ _id, skip });
    return res.status(HttpStatusCode.OK).json({
      status: !!result?.children,
      message: `Get replies ${result?.children ? "successfully" : "failed"}`,
      data: result.children
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const deleteComment = async (req, res) => {
  try {
    const user_id = req.user;
    const { _id } = req.body;

    const result = await commentRepository.deleteComment({ _id, user_id });
    return res.status(HttpStatusCode.OK).json({
      status: result?.status,
      message: `Get replies ${result?.status ? "successfully" : "failed"}`,
      data: result.status
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

export default {
  create,
  getBlogComments,
  getReplies,
  deleteComment
}