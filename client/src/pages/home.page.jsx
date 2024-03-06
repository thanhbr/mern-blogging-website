import React, { useEffect, useState } from 'react';
import AnimationWrapper from '../common/page-animation';
import InPageNavigation, { activeTabRef } from '../components/inpage-navigation.component';
import { sendRequest } from '../utils/api';
import Loader from '../components/loader.component';
import BlogPostCard from '../components/blog-content.component';
import MinialBlogPost from '../components/nobanner-blog-post.component';
import NoDataMessage from '../components/nodata.component';
import filterPaginationData from '../common/filter-pagination-data';
import LoadMoreDataBtn from '../components/load-more.component';

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  const categories = ["programming", "finances", "food", "travel", "technology"];

  const fetchLatestBlogs = async ({ page = 1 }) => {
    
    const response = await Promise.all([
      pageState === "home" 
        ? sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/latest`, { page })
        : sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/search`, { tag: pageState, page }),
    ])

    if(response?.[0]?.data?.status) {
      const resBlog = response?.[0]?.data?.data;

      const formateData = await filterPaginationData({
        state: blogs,
        data: resBlog,
        page,
        countRoute:  pageState === "home" ? "/blogs/all-latest-count" : "/blogs/search-count",
        data_to_send: { 
          tag: pageState === "home" ? "" : pageState 
        }
      });
      setBlogs(formateData);
    }
  }

  const fetchTrendingBlogs = async ({ page = 1 }) => {
    const response = await sendRequest("get", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/trending`);
    
    if(response?.data?.status) {
      const resTrendingBlogs = response?.data?.data;
      setTrendingBlogs(resTrendingBlogs);
    }
  }

  useEffect(() => {
    activeTabRef.current.click();
    fetchLatestBlogs({ page: 1 });
    
    if(!trendingBlogs) fetchTrendingBlogs({ page: 1 })
  }, [pageState]);

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();

    setBlogs(null);

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
                blogs === null
                  ? <Loader /> 
                  : (
                    blogs?.results?.length 
                      ? blogs?.results?.map((blog, i) => {
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
                      : <NoDataMessage message={"No blog published"} />
                  )
              }
              <LoadMoreDataBtn state={blogs} fetchDataFunc={fetchLatestBlogs} />
            </>
           
            <>
              {
                trendingBlogs === null 
                  ? <Loader /> 
                  : (
                    trendingBlogs?.length 
                      ? trendingBlogs?.map((blog, i) => {
                          return (
                            <AnimationWrapper 
                              key={i}
                              transition={{ duration: 1, delay: i*.1  }}
                            >
                              <MinialBlogPost blog={blog} index={i} />
                            </AnimationWrapper>
                          )
                        })
                      : <NoDataMessage message={"No trending blogs"} />
                  )
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
                trendingBlogs === null 
                  ? <Loader /> 
                  : (
                    trendingBlogs?.length
                      ? trendingBlogs?.map((blog, i) => {
                          return (
                            <AnimationWrapper 
                              key={i}
                              transition={{ duration: 1, delay: i*.1  }}
                            >
                              <MinialBlogPost blog={blog} index={i} />
                            </AnimationWrapper>
                          )
                        })
                      : <NoDataMessage message={"No trending blogs"} />
                  )
                }
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage