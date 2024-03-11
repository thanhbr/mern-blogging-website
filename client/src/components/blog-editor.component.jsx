import React, { useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from "../imgs/logo.png";
import AnimationWrapper from '../common/page-animation';
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from '../common/aws';
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from '../pages/editor.pages';
import EditorJS from "@editorjs/editorjs"
import { tools } from './tools.component';
import axios from 'axios';
import { UserContext } from '../App';
import { sendRequest } from '../utils/api';

const BlogEditor = () => {
  const { 
    blog,
    blog: {
      title,
      banner,
      content,
      tags,
      des
    },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState
   } = useContext(EditorContext);

   const { userAuth: { access_token } } = useContext(UserContext);
   const { blog_id } = useParams();

   const navigate = useNavigate();

   useEffect(() => {
      if(!textEditor.isReady) {
        setTextEditor(new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Let's write an awesome story"
        }));
      }
   }, [])

  const handleBannerUpload = (e) => {
    const img = e?.target?.files?.[0];

    if(img) {
      let loadingToast = toast.loading("Uploading...");

      uploadImage(img).then((url) => {
        toast.dismiss(loadingToast);

        if(url) {
          toast.success("Uploaded");
          setBlog({
            ...blog,
            banner: url
          })
        } else {
          toast.error("Upload failed");
        }
      })
      .catch(err => {
        toast.dismiss(loadingToast);
        return toast.error(err);
      });
    }
  }

  const handleTitleKeyDown = (e) => {
    if(e.keyCode === 13) { // enter key
      e.preventDefault();
    }
  }

  const handleTitleChange = (e) => {
    let input = e.target;


    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ 
      ...blog,
      title: input.value
    });
  }

  const handleErrorImg = (e) => {
    let img = e.target;

    img.src = defaultBanner;
  }

  const handlePublishEvent = () => {
    if(!banner.length) {
      return toast.error("Upload a blog banner to publish it")
    }
    if(!title.length) {
      return toast.error("Write blog title to publish it")
    }
    if(textEditor.isReady) {
      textEditor.save().then(data => {
        if(data?.blocks?.length > 0) {
          setBlog({
            ...blog,
            content: data
          });
          setEditorState("publish");
        } else {
          return toast.error("Write something in your blog to publish it");
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  const handleSaveDraft = async (e) => {
    e.preventDefault();

    if(e.target.className.includes("disable")) {
      return;
    }
    if(!title.length) {
      return toast.error("Write blog title before saving it as a draft");
    }

    const loadingToast = toast.loading("Saving Draft...");
    
    e.target.classList.add("disable");

    if(textEditor.isReady) {
      await textEditor.save().then(async (content) => {
          try {
            const blogObj = {
              title, banner, des, content, tags, draft: true
            }
            const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/create`, {...blogObj, id: blog_id} );
            if(response?.data?.status) {
              e.target.classList.remove("disable");
      
              toast.dismiss(loadingToast);
              toast.success("Saved");
      
              setTimeout(() => {
                navigate("/");
              }, 500);
            }
          } catch (error) {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
      
            return toast.error(response.data.message);
          }
      });
    }
  }

  return (
    <>
      <nav className='navbar'>
        <Link to="/" className='flex-none w-10'>
          <img src={logo} alt="logo" />
        </Link>
        
        <p className='max-md:hidden text-black line-clamp-1 w-full'>
          { title.length ? title : "New Blog" }
        </p>

        <div className='flex gap-4 ml-auto'>
          <button 
            className='btn-dark py-2'
            onClick={handlePublishEvent}
          >
            Publish
          </button>
          <button 
            className='btn-light py-2'
            onClick={handleSaveDraft}
          >
            Save draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className='mx-auto max-w-[900px w-full]'>

            <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey'>
              <label htmlFor='uploadBanner'>
                <img 
                  src={banner}
                  alt='default-banner'
                  className='z-20'
                  onError={handleErrorImg}
                />
                <input 
                  id='uploadBanner'
                  type='file'
                  accept='.png, .jpg, .jpeg'
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder='Blog title'
              className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-4'
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            />

            <hr className='w-full opacity-10 my-5' />

            <div 
              id="textEditor"
              className='font-gelasio'
            >

            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  )
}

export default BlogEditor