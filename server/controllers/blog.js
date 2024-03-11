import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { blogRepository } from "../repositories/index.js";

const create = async (req, res) => {
  try {
    let authorId = req.user;
    const { title, des, banner, tags, content, draft, id } = req.body;

    try {
      const user = await id 
                          ? blogRepository.update({ id, authorId, title, des, banner, tags, content, draft })
                          : blogRepository.create({ authorId, title, des, banner, tags, content, draft });
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
    const { tag, query, page, author, limit, elimitnate_blog } = req.body;
    const blogs = await blogRepository.searchBlog({ tag, query, page, author, limit, elimitnate_blog });
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
    const { tag, query, author } = req.body;
    
    const totalDocs = await blogRepository.searchCountBlog({ tag, query, author });
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

const getDetail = async (req, res) => {
  try {
    const { blog_id, draft, mode } = req.body;
    
    const detailBlog = await blogRepository.getDetail({ blog_id, draft, mode });
    res.status(HttpStatusCode.OK).json({
      status: !!detailBlog?._id,
      message: `Get detail blog ${!!detailBlog?._id ? "successfully" : "failed"}`,
      data: detailBlog
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}


const favorite = async (req, res) => {
  try {
    const { _id, isLikedByUser } = req.body;
    const user_id = req.user;
    
    const updateBlog = await blogRepository.favorite({ _id, isLikedByUser, user_id });
    res.status(HttpStatusCode.OK).json({
      status: updateBlog?.like_by_user,
      message: `Like the blog ${updateBlog?.like_by_user ? "successfully" : "failed"}`,
      data: updateBlog
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

const isLikedByUser = async (req, res) => {
  try {
    const { _id } = req.body;
    const user_id = req.user;
    
    const updateBlog = await blogRepository.isLikedByUser({ _id, user_id });
    res.status(HttpStatusCode.OK).json({
      status: updateBlog?.like_by_user,
      message: `Like the blog ${updateBlog?.like_by_user ? "successfully" : "failed"}`,
      data: updateBlog
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
  searchCount,
  getDetail,
  favorite,
  isLikedByUser
}