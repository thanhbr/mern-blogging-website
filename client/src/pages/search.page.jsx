import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InPageNavigation from '../components/inpage-navigation.component';
import AnimationWrapper from '../common/page-animation';
import BlogPostCard from '../components/blog-content.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';
import Loader from '../components/loader.component';
import filterPaginationData from '../common/filter-pagination-data';
import { sendRequest } from '../utils/api';

const SearchPage = () => {
  const { query } = useParams();
  const [blogs, setBlogs] = useState(null);

  const searchBlogs = async ({ page = 1, create_new_arr = false }) => {
    const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/search`, { query, page });
    
    if(response?.data?.status) {
      const responseBlogs = response?.data?.data
      const formateData = await filterPaginationData({
        state: blogs,
        data: responseBlogs,
        page,
        countRoute: "/blogs/search-count",
        data_to_send: { query },
        create_new_arr
      });
      setBlogs(formateData);

    }
  }

  const resetState = () => {
    setBlogs(null);
  }

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
  }, [query]);

  return (
    <section className='h-cover flex justify-center gap-10'>
      <div className='w-full'>
        <InPageNavigation 
          routes={[`Search results from ${query}`, "Accounts matched"]}
          defaultHidden={"Accounts matched"}
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
            <LoadMoreDataBtn state={blogs} fetchDataFunc={searchBlogs} />
          </>
        </InPageNavigation>
      </div>
    </section>
  )
}

export default SearchPage