import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { blogRepository } from "../repositories/index.js";

const create = async (req, res) => {
  try {
    let authorId = req.user;
    console.log('authorId', authorId);
    const { title, des, banner, tags, content, draft } = req.body;

    try {
      const user = await blogRepository.create({ authorId, title, des, banner, tags, content, draft });
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: 'Create blog successfully',
        data: user
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.toString()
      })
    }
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({err: err});
  }
}

export default {
  create
}