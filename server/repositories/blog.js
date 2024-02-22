
import { nanoid } from "nanoid";
import Exception from "../exceptions/Exception.js";
import { BlogModal, UserModal } from "../Schema/index.js";


const create = async ({ authorId, title, des, banner, tags, content, draft }) => {
  // =========== Validating data from frontend ===========
  const validations = [
    { condition: !title.length, error: Exception.FAILED_BLOG_TITLE },
    { condition: !des.length || des.length > 200, error: Exception.FAILED_BLOG_DESC },
    { condition: !banner.length, error: Exception.FAILED_BLOG_BANNER },
    { condition: !content?.blocks?.length, error: Exception.FAILED_BLOG_CONTENT },
    { condition: !tags.length || tags.length > 10, error: Exception.FAILED_BLOG_TAG }
  ];

  for (const validation of validations) {
    if (validation.condition) {
      throw new Exception(validation.error);
    }
  }
  // =========== End validating data from frontend ===========

  tags = tags?.map(tag => tag.toLowerCase());
  const blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
  
  // try {
  //   const newBlog = await BlogModal.create({
  //     blog_id,
  //     title,
  //     des,
  //     banner,
  //     content,
  //     tags,
  //     author: authorId,
  //     draft: Boolean(draft)
  //   });
  //   if(newBlog?._doc?._id) {
  //     const updatedUser = await UserModal.findOneAndUpdate(
  //       { _id: authorId },
  //       { $inc: {"account_info.total_posts": incrementVal},
  //           $push: { "blogs": blog_id } 
  //     })
  //     console.log('newBlog', newBlog);
  //     console.log('updatedUser', updatedUser);
  //     return newBlog;
  //   }
    
  // } catch (error) {
  //   throw new Exception(Exception.FAILED_BLOG_CREATE); 
  // }

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
      let incrementVal = draft ? 0 : 1;
      UserModal.findOneAndUpdate(
        { _id: authorId },
        { $inc: {"account_info.total_posts": incrementVal},
            $push: { "blogs": blog_id } 
      }).then(user => {
        return {
          id: blog.blog_id
        }
      }).catch((err) => {
        throw new Exception(Exception.FAILED_BLOG_CREATE); 
      })
    })
  } catch (error) {
    throw new Exception(Exception.FAILED_BLOG_CREATE); 
  }

}

export default {
  create
}