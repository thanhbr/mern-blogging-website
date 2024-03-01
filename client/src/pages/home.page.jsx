import React, { useEffect, useState } from 'react';
import AnimationWrapper from '../common/page-animation';
import InPageNavigation from '../components/inpage-navigation.component';
import { sendRequest } from '../utils/api';
import Loader from '../components/loader.component';
import BlogPostCard from '../components/blog-content.component';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const fetchLatestBlogs = async () => {
    const response = await sendRequest("get", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/latest`);

    if(response?.data?.status) {
      setBlogs(response?.data?.data);
    }
  }

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className='h-cover flex justify-center gap-10'>
        {/* lastest blogs */}
        <div className='w-full'>
          <InPageNavigation 
            routes={['home', 'trending blogs']}
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
           
            <h1>Trending Blogs Here</h1>
          </InPageNavigation>
        </div>

        {/* filters and treding blogs */}
        <div>

        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage