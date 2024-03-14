
import { BlogModal, CommentModal, NotificationModal } from "../Schema/index.js";
import Exception from "../exceptions/Exception.js";

const createComment = async ({ _id, user_id, commentReq, blog_author, replying_to }) => {
  try {
    if(!commentReq?.length) {
      throw new Exception("Write something to leave a comment..."); 
    }

    // creating a comment doc
    const commentObj = {
      blog_id: _id,
      blog_author,
      comment: commentReq?.trim(),
      commented_by: user_id
    };

    if(replying_to) {
      commentObj.parent = replying_to;
    }

    const result = new CommentModal(commentObj).save().then(async commentFile => {
      let { comment, commentedAt, children } = commentFile;

      await BlogModal.findOneAndUpdate({ _id }, { $push: {"comments": commentFile._id}, $inc: {"activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1} })
                .then(blog => console.log("New comment created" + blog));

      let notificationObject = {
        type: replying_to ? "reply" : "comment",
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentFile._id
      };

      if(replying_to) {
        notificationObject.replied_on_comment = replying_to;

        await CommentModal.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentFile._id } })
                          .then(replyingToCommentDoc => {
                            notificationObject.notification_for = replyingToCommentDoc.commented_by
                          })
      }

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