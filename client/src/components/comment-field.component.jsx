import React, { useContext, useState } from 'react'
import { UserContext } from '../App';
import toast, { Toaster } from 'react-hot-toast';
import { BlogContext } from '../pages/blog.page';
import { sendRequest } from '../utils/api';

const CommendField = ({ action }) => {
  const { userAuth: { access_token, username, fullname, profile_img } } = useContext(UserContext);
  const { 
    blog, 
    blog: {
      _id, 
      author: { 
        _id: blog_author 
      }, 
      comments, 
      comments: {
        results: commentsArr
      },
      activity,
      activity: {
        total_comments,
        total_parent_comments
      }
    }, 
    setBlog,
    setTotalParentCommentsLoaded
  } = useContext(BlogContext);

  const [comment, setComment] = useState("");

  const handleComment = async () => {
    if(!access_token) {
      return toast.error("Login first to have a comment");
    }
    if(!comment.length) {
      return toast.error("Write something to leave a comment...");
    }
    
    const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/comments/create`, {_id, blog_author, comment});
    if(response?.data?.status) {
      const data = response?.data?.data;

      setComment("");
      data.commented_by = { personal_info: { username, fullname, profile_img } };

      let newCommentArr;
      data.childrenLevel = 0;

      newCommentArr = [data, ...commentsArr];

      let parentCommentIncrementVal = 1;
      setBlog({
        ...blog, 
        comments: {
          ...comments, 
          results: newCommentArr
        }, 
        activity: {
          ...activity, 
          total_comment: total_comments + 1, 
          total_parent_comments: total_parent_comments + parentCommentIncrementVal
        }
      });

      setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementVal);
    }
  }

  return (
    <>
      <Toaster />
      <textarea 
        value={comment} 
        placeholder='Leave a comment' 
        className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
        onChange={e => setComment(e.target.value)}
      />
      <button
        className='btn-dark mt-5 px-10'
        onClick={handleComment}
      >
        {action}
      </button>
    </>
  )
}

export default CommendField