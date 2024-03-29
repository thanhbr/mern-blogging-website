import React, { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sendRequest } from '../utils/api';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { getDay } from "../common/date";
import BlogInteraction from '../components/blog-interaction.component';
import BlogPostCard from '../components/blog-post.component';
import BlogContent from '../components/blog-content.component';
import CommentsContainer, { fetchComments } from '../components/comments.component';


export const blogStructure = {
  title: "",
  des: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: ""
}

export const BlogContext = createContext({});

const BlogPage = () => {

  const { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  const { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog;


  const fetchBlog = async () => {
    try {
      const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/detail`, { blog_id });
      if (response?.data?.status) {
        const responseBlog = response?.data?.data;
        responseBlog.comments = await fetchComments({ blog_id: responseBlog._id, setParentCommentCountFun: setTotalParentCommentsLoaded }) || 0;

        setBlog(responseBlog);

        
        const responseSearch = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/search`, { tag: responseBlog?.tags?.[0], limit: 6, elimitnate_blog: blog_id });
        if(responseSearch?.data?.status) {
          setSimilarBlogs(responseSearch?.data?.data);
        }
      } else {
        // Handle unsuccessful response (optional)
        console.error("Blog detail retrieval failed:", response);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      // Handle other errors (e.g., network issues)
      setLoading(false); // Assuming you want to stop loading indicator on error
    } finally {
      setLoading(false); // Ensure loading indicator is stopped even if successful
    }
  }

  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    // setLikedByUser(false);
    setTotalParentCommentsLoaded(0);
  }

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);


  return (
    <AnimationWrapper>
      {
        loading
          ? <Loader />
          : (<BlogContext.Provider value={{ blog, 
                                            setBlog, 
                                            isLikedByUser, 
                                            setLikedByUser,
                                            commentsWrapper,
                                            setCommentsWrapper,
                                            totalParentCommentsLoaded,
                                            setTotalParentCommentsLoaded }}>
              <CommentsContainer />
              <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                  <img 
                    src={banner}
                    alt='image-banner'
                    className='aspect-video'
                  />
                  <div className='mt-12'>
                    <h2>{title}</h2>
                    <div className='flex max-sm:flex-col justify-between my-8'>
                      <div className='flex gap-5 items-start'>
                        <img 
                          src={profile_img} 
                          alt='profile-image'
                          className='w-12 h-12 rounded-full'
                        />
                        <p className='capitalize'>
                          {fullname}<br />@<Link to={`/user/${author_username}`} className='underline'>{author_username}</Link>
                        </p>
                      </div>
                      <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>
                        Published on {getDay(publishedAt)}
                      </p>
                    </div>
                  </div>

                  <BlogInteraction />

                  <div className='my-12 font-gelasio blog-page-content'>
                    {
                      content[0]?.blocks?.map((block, i) => {
                        return <div key={i} className='my-4 md:my-8'>
                          <BlogContent block={block} />
                        </div>
                      })
                    }
                  </div>

                  {/* <BlogInteraction /> */}

                  {
                    similarBlogs !== null && similarBlogs?.length
                      ? <>
                        <h1 className='text-2xl mt-14 mb-10 font-medium'>
                          Similar Blogs
                        </h1>
                        {
                          similarBlogs?.map((blog, i) => {
                            const { author: { personal_info } } = blog;
                            return <AnimationWrapper key={i} transition={{  daration: 1, delay: i * 0.08 }}>
                              <BlogPostCard data={blog} />
                            </AnimationWrapper>
                          })
                        }
                      </>
                      : " "
                  }
                </div>
              </BlogContext.Provider> 
            )
      }
    </AnimationWrapper>
  )
}

export default BlogPage