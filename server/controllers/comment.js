import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { commentRepository } from "../repositories/index.js";

const create = async (req, res) => {
  try {
    const user_id = req.user;
    const {_id, comment, blog_author} = req.body;

    const result = await commentRepository.createComment({ _id, user_id, commentReq: comment, blog_author });
    return res.status(HttpStatusCode.OK).json({status: result});
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

export default {
  create
}