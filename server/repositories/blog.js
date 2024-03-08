
import { nanoid } from "nanoid";
import Exception from "../exceptions/Exception.js";
import { BlogModal, UserModal } from "../Schema/index.js";


const create = async ({ authorId, title, des, banner, tags, content, draft }) => {
  // =========== Validating data from frontend ===========
  const validations = [
    { condition: !title.length, error: Exception.FAILED_BLOG_TITLE },
    { condition: (!des.length || des.length > 200) && !draft, error: Exception.FAILED_BLOG_DESC },
    { condition: (!banner.length) && !draft, error: Exception.FAILED_BLOG_BANNER },
    { condition: (!content?.blocks?.length) && !draft, error: Exception.FAILED_BLOG_CONTENT },
    { condition: (!tags.length || tags.length > 10) && !draft, error: Exception.FAILED_BLOG_TAG }
  ];

  for (const validation of validations) {
    if (validation.condition) {
      throw new Exception(validation.error);
    }
  }
  // =========== End validating data from frontend ===========

  tags = tags?.map(tag => tag.toLowerCase());
  const blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
  

  try {
    const newBlog = new BlogModal({
      blog_id,
      title,
      des,
      banner,
      content,
      tags,
      author: authorId,
      draft: Boolean(draft)
    });
    return newBlog.save().then(blog => {
      const incrementVal = draft ? 0 : 1;
      UserModal.findOneAndUpdate(
        { _id: authorId },
        { $inc: {"account_info.total_posts": incrementVal},
            $push: { "blogs": newBlog._id } 
      }).then(user => {
        return {
          id: newBlog.blog_id
        }
      }).catch((err) => {
        throw new Exception(Exception.FAILED_BLOG_CREATE); 
      })
    })
  } catch (error) {
    throw new Exception(Exception.FAILED_BLOG_CREATE); 
  }

}

const latestBlog = async ({page}) => {
  let maxLimit = 5;
  try {
    const blogs = await BlogModal.find({ draft: false })
                                  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
                                  .sort({ "publishedAt": -1 })
                                  .select("blog_id title des banner activity tags publishedAt -_id")
                                  .skip((page - 1) * maxLimit)
                                  .limit(maxLimit);
    return blogs;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

const trendingBlog = async ({}) => {
  try {
    
    const blogs = await BlogModal.find({ draft: false })
                                  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
                                  .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
                                  .select("blog_id title publishedAt -_id")
                                  .limit(5);
    return blogs;

  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

const searchBlog = async ({ tag, query, page, author }) => {
  try {
    const maxLimit = 5;
    let findQuery;
    
    if(tag) {
      findQuery = { tags: tag, draft: false };
    } else if (query) {
      findQuery = { draft: false, title: new RegExp(query, "i") };
    } else if (author) {
      findQuery = { author, draft: false };
    }
    

    const blogs = await BlogModal.find(findQuery)
                                  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
                                  .sort({ "publishedAt": -1 })
                                  .select("blog_id title des banner activity tags publishedAt -_id")
                                  .skip((page - 1) * maxLimit)
                                  .limit(maxLimit);
    return blogs;

  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

const allLatestBlog = async () => {
  
  try {
    const totalDocs = await BlogModal.countDocuments({ draft: false });
    return totalDocs;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

const searchCountBlog = async ({ tag, query, author }) => {
  try {
    let findQuery;
    
    if(tag) {
      findQuery = { tags: tag, draft: false };
    } else if (query) {
      findQuery = { draft: false, title: new RegExp(query, "i") }
    } else if (author) {
      findQuery = { author, draft: false };
    }

    const totalDocs = await BlogModal.countDocuments(findQuery);
    return totalDocs;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

const getDetail = async ({ blog_id }) => {
  try {

    let incrementVal = 1;
    const blog = await BlogModal.findOneAndUpdate({ blog_id }, { $inc: {"activity.total_reads": incrementVal} })
                                .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
                                .select("title des banner content activity publishedAt blog_id tags");

    // const user = await UserModal.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementVal } });
                                
    return blog;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}


export default {
  create,
  searchBlog,
  latestBlog,
  trendingBlog,
  allLatestBlog,
  searchCountBlog,
  getDetail
}