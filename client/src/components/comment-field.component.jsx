import React, { useContext, useState } from 'react'
import { UserContext } from '../App';
import toast, { Toaster } from 'react-hot-toast';
import { BlogContext } from '../pages/blog.page';
import { sendRequest } from '../utils/api';

const CommendField = ({ action }) => {
  const { userAuth: { access_token } } = useContext(UserContext);
  const { blog: {_id, author: { _id: blog_author }} } = useContext(BlogContext);

  const [comment, setComment] = useState("");
  console.log('blog_author', blog_author);

  const handleComment = async () => {
    if(!access_token) {
      return toast.error("Login first to have a comment");
    }
    if(!comment.length) {
      return toast.error("Write something to leave a comment...");
    }
    
    const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/comments/create`, {_id, blog_author, comment});
    if(response?.data?.status) {
      console.log(123, response?.data?.data);
    }
    console.log(456, response);
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