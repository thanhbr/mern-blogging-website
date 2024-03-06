import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { blogRepository } from "../repositories/index.js";

const create = async (req, res) => {
  try {
    let authorId = req.user;
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
      });
    }
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({err: err});
  }
}


const latestBlog = async (req, res) => {
  try {
    const { page } = req.body;

    const latestBlog = await blogRepository.latestBlog({page});
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: 'Get blog successfully',
      data: latestBlog
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const trendingBlog = async (req, res) => {
  try {
    const blogs = await blogRepository.trendingBlog({});
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: 'Get blogs successfully',
      data: blogs
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const search = async (req, res) => {
  try {
    const { tag, page } = req.body;
    const blogs = await blogRepository.searchBlog({ tag, page });
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: 'Get blogs successfully',
      data: blogs
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const allLatestBlog = async (req, res) => {
  try {
    const totalDocs = await blogRepository.allLatestBlog();
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: 'Get blog successfully',
      data: {
        totalDocs
      }
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const searchCount = async (req, res) => {
  try {
    const { tag } = req.body;
    
    const totalDocs = await blogRepository.searchCountBlog({tag});
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: 'Get blog successfully',
      data: {
        totalDocs
      }
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}


export default {
  create,
  search,
  latestBlog,
  trendingBlog,
  allLatestBlog,
  searchCount
}