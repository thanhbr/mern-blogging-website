import React, { useContext, useEffect } from 'react';
import { BlogContext } from '../pages/blog.page';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { sendRequest } from '../utils/api';

const BlogInteraction = () => {

  let { 
    blog,
    blog: { 
      _id,
      blog_id, 
      title,
      activity,
      activity: {
        total_likes,
        total_comments
      },
      author: {
        personal_info: {
          username: author_username
        }
      },
    },
    setBlog,
    isLikedByUser,
    setLikedByUser
  } = useContext(BlogContext);

  const { 
    userAuth: {
      username,
      access_token
    }
   } = useContext(UserContext);

   useEffect(() => {
    if(access_token) {
      // make request to server to get like information
    }
   }, [])


  const handleLike = async () => {
    if(access_token) {
        // like the blog
        setLikedByUser(preVal => !preVal);

        !isLikedByUser ? total_likes++ : total_likes--
        setBlog({
          ...blog,
          activity: {
            ...activity,
            total_likes
          }
        })

        const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/favorite`, { _id, isLikedByUser });
        if(response?.data?.status) {
          console.log(123, response?.data?.data);
        } else {
          console.log(456, response);
        }

    } else {
      toast.error("login to like this blog")
    }
   }

  return (
    <>
      <Toaster />
      <hr className='border-grey my-2' />
      <div className='flex gap-6 justify-between'>
        <div className='flex gap-3 items-center'>
          <button
            onClick={handleLike} 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80"}`}
          >
            <i className={`fi ${isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`} />
          </button>
          <p className='text-xl text-dark-grey'>
            { total_likes }
          </p>
          
          <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
            <i className='fi fi-rr-comment-dots' />
          </button>
          <p className='text-xl text-dark-grey'>
            { total_comments }
          </p>
        </div>

        <div className='flex gap-6 items-center'>
          {
            username === author_username
              ? <Link 
                  to={`/editor/${blog_id}`}
                  className='underline hover:text-purple'
                >
                  Edit
                </Link> 
              : ""
          }
          <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
            <i className='fi fi-brands-twitter text-xl hover:text-twitter' />
          </Link>
        </div>
      </div>
      <hr className='border-grey my-2' />
    </>
  )
}

export default BlogInteraction