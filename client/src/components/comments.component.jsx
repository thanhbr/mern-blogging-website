import React, { useContext } from 'react'
import { BlogContext } from '../pages/blog.page';
import CommendField from './comment-field.component';
import { sendRequest } from '../utils/api';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
  let res;
  const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/comments/get-blog-comments`, {blog_id, skip});
  
  if(response?.data?.status) {
    const data = response?.data?.data;

    data.map(comment => {
      comment.childrenLevel = 0;
    });

    setParentCommentCountFun(preVal => preVal + data.length);

    if(comment_array === null) {
      res = { results: data };
    } else {
      res = { 
        results: [
          ...comment_array, 
          ...data 
        ] 
      };
    }
    return res;
  }

}

const CommentsContainer = () => {
  const {
    blog: {
      title,
      comments: {
        results: commentsArr
      }
    },
    commentsWrapper, 
    setCommentsWrapper 
  } = useContext(BlogContext);


  return (
    <div className={`max-sm:w-full fixed ${commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"} duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}>
      <div className='relative'>
        <h1 className='text-xl font-medium'>Comments</h1>
        <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>
          {title}
        </p>

        <button 
          onClick={() => setCommentsWrapper(preVal => !preVal)}
          className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'
        >
          <i className='fi fi-br-cross text-2xl mt-1' />
        </button>
      </div>

      <hr className='border-grey my-8 w-[120%] -ml-10' />

      <CommendField action="comment" />

      {
        commentsArr && commentsArr.length 
          ? commentsArr.map((comment, i) => {
            return <AnimationWrapper key={i}>
              <CommentCard commentData={comment} index={i} leftVal={comment.childrenLevel * 4} />
            </AnimationWrapper>
          })
          : <NoDataMessage message={"no comments"} />
      }
    </div>
  )
}

export default CommentsContainer