import React, { useEffect, useState } from 'react';
import AnimationWrapper from '../common/page-animation';
import InPageNavigation, { activeTabRef } from '../components/inpage-navigation.component';
import { sendRequest } from '../utils/api';
import Loader from '../components/loader.component';
import BlogPostCard from '../components/blog-content.component';
import MinialBlogPost from '../components/nobanner-blog-post.component';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [pageState, setPageState] = useState("home");

  const categories = ["programming", "finances", "food", "travel", "technology"];

  const fetchLatestBlogs = async () => {
    
    const response = await Promise.all([
      pageState === "home" 
        ? sendRequest("get", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/latest`)
        : sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/search`, {tag: pageState}),
      sendRequest("get", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/trending`)
    ])

    if(response?.[0]?.data?.status) {
      setBlogs(response?.[0]?.data?.data);
    }

    if(response?.[1]?.data?.status) {
      setTrendingBlogs(response?.[1]?.data?.data);
    }
  }

  useEffect(() => {
    activeTabRef.current.click();
    fetchLatestBlogs();
  }, [pageState]);

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();

    setBlogs([]);

    if(pageState === category) {
      setPageState("home");
      return
    }

    setPageState(category);
  };

  return (
    <AnimationWrapper>
      <section className='h-cover flex justify-center gap-10'>
        {/* lastest blogs */}
        <div className='w-full'>
          <InPageNavigation 
            routes={[pageState, 'trending blogs']}
            defaultHidden={["trendingblogs"]}
          >
            <>
              {
                blogs.length === 0 
                  ? <Loader /> 
                  : blogs?.map((blog, i) => {
                    return (
                      <AnimationWrapper 
                        key={i}
                        transition={{ duration: 1, delay: i*.1  }}
                      >
                        <BlogPostCard 
                          data={blog}
                        />
                      </AnimationWrapper>
                    )
                  })
              }
            </>
           
            <>
              {
                trendingBlogs.length === 0 
                  ? <Loader /> 
                  : trendingBlogs?.map((blog, i) => {
                    return (
                      <AnimationWrapper 
                        key={i}
                        transition={{ duration: 1, delay: i*.1  }}
                      >
                        <MinialBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    )
                  })
                }
            </>
          </InPageNavigation>
        </div>

        {/* filters and treding blogs */}
        <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
          <div className='flex flex-col gap-10'>
            <div className=''>
              <h1 className='font-medium text-xl mb-8'>
                Stories form all interests
              </h1>
              <div className='flex gap-3 flex-wrap'>
                {
                  categories.map((category, i) => {
                    return (
                      <button 
                        key={i} 
                        className={`tag ${pageState === category ? "bg-black text-white" : " "}`}
                        onClick={loadBlogByCategory}
                      >
                        { category }
                      </button>
                    )
                  })
                }
              </div>
            </div>

            <div>
              <h1 className='font-medium text-xl mb-8'>
                Trending {" "}
                <i className='fi fi-rr-arrow-trend-up' />
              </h1>

              {
                trendingBlogs.length === 0 
                  ? <Loader /> 
                  : trendingBlogs?.map((blog, i) => {
                    return (
                      <AnimationWrapper 
                        key={i}
                        transition={{ duration: 1, delay: i*.1  }}
                      >
                        <MinialBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    )
                  })
                }
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage