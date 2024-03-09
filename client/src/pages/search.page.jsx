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
import UserCard from '../components/usercard.component';

const SearchPage = () => {
  const { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

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
    setUsers(null);
  }

  const fetchUsers = async () => {
    try {
      const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/users/search`, { query });
  
      if (response?.data?.data?.length) {
        const responseUsers = response?.data?.data;
        setUsers(responseUsers);
      } else {
        // Handle empty response (optional)
        console.log("No users found for your search query.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle other errors (optional)
      // Assuming you want to stop loading indicator on error
    } finally {
      // Ensure loading indicator is stopped even if successful
    }
  };
  

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers()
  }, [query]);

  const UserCardWrapper = () => {
    return (
      <>
        {
          users === null 
            ? <Loader />
            : users.length
              ? users?.map((user, i) => {
                  return (
                    <AnimationWrapper key={i} transition={{ daration: 1, delay: i*0.08 }}>
                      <UserCard user={user} />
                    </AnimationWrapper>
                  )  
                })
              : <NoDataMessage message="No user found" />
        }
      </>
    )
  }

  return (
    <section className='h-cover flex justify-center gap-10'>
      <div className='w-full'>
        <InPageNavigation 
          routes={[`Search results from "${query}"`, "Accounts matched"]}
          defaultHidden={["Accounts matched"]}
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
          <UserCardWrapper />

        </InPageNavigation>
      </div>

      <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
        <h1 className='font-medium text-xl mb-8'>
          User related to search <i className='fi fi-rr-user mt-1' />
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  )
}

export default SearchPage