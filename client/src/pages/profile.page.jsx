import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sendRequest } from '../utils/api';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { UserContext } from '../App';
import AboutUser from '../components/about.component';
import filterPaginationData from '../common/filter-pagination-data';
import InPageNavigation from '../components/inpage-navigation.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';
import PageNotFound from './404.page';
import BlogPostCard from '../components/blog-post.component';

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: ""
  },
  account_info: {
    total_posts: 0,
    total_reads: 0
  },
  social_links: {},
  joinedAt: ""
}

const ProfilePage = () => {
  const { id: profileId } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState("");

  const {
    personal_info: {
      fullname,
      username: profile_username,
      profile_img,
      bio
    },
    account_info: {
      total_posts,
      total_reads
    },
    social_links,
    joinedAt
  } = profile;

  const { 
    userAuth: { username }
   } = useContext(UserContext)

   const fetchUserProfile = async () => {
    try {
      const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/users/profile`, { username: profileId });
  
      if (response?.data?.status) {
        const responseUser = response?.data?.data;
        setProfile(responseUser);
        setProfileLoaded(profileId);
        getBlog({ user_id: responseUser._id });
      } else {
        // Handle unsuccessful response (optional)
        console.error("User profile retrieval failed:", response);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Handle other errors (optional)
      // Assuming you want to stop loading indicator on error
      setLoading(false);
    } finally {
      setLoading(false); // Ensure loading indicator is stopped even if successful
    }
  };

  const getBlog = async ({ page = 1, user_id }) => {
    user_id = blogs?.user_id ?? user_id;
    const response = await sendRequest("post",  `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/search`, { author: user_id, page });
    if(response?.data?.status) {
      const formatData = await filterPaginationData({
        state: blogs,
        data: response?.data?.data,
        page,
        countRoute: "/blogs/search-count",
        data_to_send: { author: user_id }
      });

      formatData.user_id = user_id;
      setBlogs(formatData);
    }
  }

  useEffect(() => {
    if(profileId !== profileLoaded) {
      setBlogs(null);
    }
    if(blogs === null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs])

  
  return (
    <AnimationWrapper>
      {
        loading 
          ? <Loader /> 
          : profile_username?.length 
            ? (
              <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10'>
                  <img 
                    src={profile_img} 
                    alt='profile-image'
                    className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32'
                  />
                  <h1 className='text-2xl font-medium'>
                    @{profile_username}
                  </h1>
                  <p className='text-xl capitalize h-6'>
                    {fullname}
                  </p>
                  <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>

                  <div className='flex gap-4 mt-2'>
                    {
                      profileId === username
                        ? <Link 
                            to="/setting/edit-profile"
                            className='btn-light rounded-md'
                          >
                            Edit Profile
                          </Link>
                        : ""
                    }
                  </div>

                  <AboutUser 
                    className={'max-md:hidden'}
                    bio={bio} 
                    socialLinks={social_links} 
                    joinedAt={joinedAt}
                  />
                </div>

                <div className='max-md:mt-12 w-full'>
                    <InPageNavigation
                      routes={["blogs published", 'about']}
                      defaultHidden={["about"]}
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
                                        <BlogPostCard data={blog} />
                                      </AnimationWrapper>
                                    )
                                  })
                                : <NoDataMessage message={"No blog published"} />
                            )
                        }
                        <LoadMoreDataBtn state={blogs} fetchDataFunc={getBlog} />
                      </>
                    
                      <AboutUser 
                        bio={bio} 
                        socialLinks={social_links}
                        joinedAt={joinedAt}
                      />
                    </InPageNavigation>
                </div>
              </section>
            )
            : <PageNotFound />
      }
    </AnimationWrapper>
  )
}

export default ProfilePage