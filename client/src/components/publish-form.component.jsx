import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import toast, { Toaster } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import Tags from './tags.component'

const PublishForm = () => {
  const characterLimit = 200;
  const tagLimit = 10;

  const { 
    blog,
    blog: {
      banner,
      title,
      des,
      tags
    },
    setEditorState,
    setBlog 
  } = useContext(EditorContext);

  const handleCloseEvent = () => {
    setEditorState("editor");
  }

  const handleBlogTitleChange = (e) => {
    const input = e.target;
    setBlog({
      ...blog,
      title: input.value
    })
  }

  const handleBlogDescChange = (e) => {
    const input = e.target;
    setBlog({
      ...blog,
      des: input.value
    });
  }

  const handleTitleKeyDown = (e) => {
    if(e.keyCode === 13) {
      e.preventDefault();
    }
  }

  const handleKeyDownTag = (e) => {
    if(e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let tag = e.target.value;

      if(tags.length < tagLimit) {
        if(!tags.includes(tag) && tag.length) {
          setBlog({
            ...blog,
            tags: [
              ...tags,
              tag
            ]
          })
        }
      } else {
        toast.error(`You can add max ${tagLimit} tags`)
      }
      e.target.value = "";
    }
  }

  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 lg:gap-4 py-16'>
        <Toaster />

        <button 
          className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]'
          onClick={handleCloseEvent}
        >
          <i className='fi fi-br-cross' />
        </button>

        <div className='max-w-[550px] center'>
          <p className='text-dark-grey mb-1'>Preview</p>
          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img 
              src={banner} 
              alt="banner"
            />
          </div>

          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{des}</p>
        </div>

        <div className='border-grey lg:border-1 lg:pl-8'>
          <p className='text-dark-grey mb-2 mt-9'>Blog title</p>
          <input 
            type="text" 
            placeholder='Blog title' 
            defaultValue={title}
            className='input-box pl-4'
            onChange={handleBlogTitleChange}
          />

          
          <p className='text-dark-grey mb-2 mt-9'>
            Short description about your blog
          </p>

          <textarea 
            maxLength={characterLimit}
            defaultValue={des}
            className='h-40 resize-none leading-7 input-box pl-4'
            onChange={handleBlogDescChange}
            onKeyDown={handleTitleKeyDown}
          />
          <p className='mt-1 text-dark-grey text-sm text-right'>
            {characterLimit - des.length} characters left
          </p>

          <p className='text-dark-grey mb-2 mt-9'>
            Topics - ( Help is searching and ranking your blog post )
          </p>

          <div className='relative input-box pl-2 py-2 pb-4'>
            <input 
              type="text" 
              placeholder='Topic'
              className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
              onKeyDown={handleKeyDownTag}
            />
            {tags.map((tag, i) => {
              return <Tags key={i} tag={tag} tagIndex={i} />
            })}
          </div>
          <p className='mt-1 mb-4 text-dark-grey text-right'> 
            {tagLimit - tags.length} Tags left 
          </p>

          <button className='btn-dark px-8'>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm