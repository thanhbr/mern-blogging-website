
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
      commented_by: user_id
    });

    const result = commentObj.save().then(async commentFile => {
      let { comment, commentedAt, children } = commentFile;

      await BlogModal.findOneAndUpdate({ _id }, { $push: {"comments": commentFile._id}, $inc: {"activity.total_comments": 1, "activity.total_parent_comments": 1} })
                .then(blog => console.log("New comment created" + blog));

      let notificationObject = {
        type: "comment",
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentFile._id
      };
      await new NotificationModal(notificationObject).save().then(() => console.log("New notify created"));

      return {
        comment,
        commentedAt,
        _id: commentFile._id,
        user_id,
        children
      }
    });
    return result;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_COMMENT); 
  }
}

const getBlogComments = async ({ blog_id, skip }) => {
  try {
    const maxLimit = 5;
    const comments = await CommentModal.find({blog_id, isReply: false})
                                        .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
                                        .skip(skip)
                                        .limit(maxLimit)
                                        .sort({ "commentedAt": -1 });
    return comments;
  } catch (error) {
    throw new Exception(Exception.GET_FAILED_COMMENT); 
    
  }
}


export default {
  createComment,
  getBlogComments
}