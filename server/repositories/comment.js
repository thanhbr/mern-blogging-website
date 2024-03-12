
import { BlogModal, CommentModal, NotificationModal } from "../Schema/index.js";
import Exception from "../exceptions/Exception.js";

const createComment = async ({ _id, user_id, commentReq, blog_author }) => {
  try {
    if(!commentReq?.length) {
      throw new Exception("Write something to leave a comment..."); 
    }

    // creating a comment doc
    const commentObj = new CommentModal({
      blog_id: _id,
      blog_author,
      comment: commentReq?.trim(),
      comment_by: user_id
    });

    commentObj.save().then(commentFile => {
      let { _id, comment, commentedAt, children } = commentFile;
      return { _id, comment, commentedAt, children };


    // await BlogModal.findOneAndUpdate({ _id }, { $push: {"comments": commentFile._id}, $inc: {"activity.total_comments": 1}, "activity.total_parent_comments": 1 });

    // const notificationObject = {
    //   type: "comment",
    //   blog: _id,
    //   notification_for: blog_author,
    //   user: user_id,
    //   comment: commentFile._id
    // };
    // await new NotificationModal(notificationObject).save();

    // return {
    //   comment,
    //   commentedAt,
    //   _id: commentFile._id,
    //   user_id,
    //   children
    // }
    });
    return 1;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_BLOG); 
  }
}


export default {
  createComment
}