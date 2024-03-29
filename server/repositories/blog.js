
import { nanoid } from "nanoid";
import Exception from "../exceptions/Exception.js";
import { BlogModal, UserModal, NotificationModal } from "../Schema/index.js";
import { slugify } from "../helpers/slugify.js";


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
  const blog_id = slugify(title.trim(), nanoid(5));
  

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


const update = async ({ id, authorId, title, des, banner, tags, content, draft }) => {
  try {
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
  const blog_id = id || slugify(title.trim(), nanoid(5));
  

  BlogModal.findOneAndUpdate({ blog_id }, { title, des, banner, content, tags, draft: draft ? draft : false })
            .then(() => {
              return {
                id: blog_id
              }
            })
            .catch(err => {
              throw new Exception("Failed to update total posts number"); 
            });
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

const searchBlog = async ({ tag, query, page, author, limit, elimitnate_blog }) => {
  try {
    const maxLimit = limit || 5;
    let findQuery;
    
    if(tag) {
      findQuery = { tags: tag, draft: false, blog_id: { $ne: elimitnate_blog } };
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

const getDetail = async ({ blog_id, draft, mode }) => {
  try {

    let incrementVal = mode !== "edit" ? 1 : 0;
    const blog = await BlogModal.findOneAndUpdate({ blog_id }, { $inc: {"activity.total_reads": incrementVal} })
                                .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
                                .select("title des banner content activity publishedAt blog_id tags");

    // const user = await UserModal.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementVal } });
    if(blog.draft && !draft) {
      throw new Exception(Exception.YOU_CANNOT_ACCESS_DRAFT); 

    }        
    
    return blog;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

const favorite = async ({_id, isLikedByUser, user_id}) => {
  try {
    const incrementVal = !isLikedByUser ? 1 : -1;
    const blog = await BlogModal.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } });

    if(!isLikedByUser) {
      const like = new NotificationModal({
        type: "like",
        blog: _id,
        notification_for: blog.author,
        user: user_id
      });
      
      await like.save();

      return {
        like_by_user: true
      };
    } else {
      await NotificationModal.findOneAndDelete({
        user: user_id,
        blog: _id,
        type: "like"
      })

      return {
        like_by_user: false
      };
    }

  } catch (error) {
    
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

const isLikedByUser = async ({_id, user_id}) => {
  try {
    const hasLiked = NotificationModal.exists({ user: user_id, type: "like", blog: _id });
    return hasLiked;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}

export default {
  create,
  update,
  searchBlog,
  latestBlog,
  trendingBlog,
  allLatestBlog,
  searchCountBlog,
  getDetail,
  favorite,
  isLikedByUser
}