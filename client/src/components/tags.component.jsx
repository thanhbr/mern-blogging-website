import React, { useContext } from 'react'
import { EditorContext } from '../pages/editor.pages'

const Tags = ({ tag, tagIndex }) => {
  const { 
    blog,
    setBlog,
    blog: { tags }
   } = useContext(EditorContext)

  const handleTagDelete = () => {
    setBlog({
      ...blog,
      tags: tags.filter(t => t !== tag)
    });
  }

  const handleTagEdit = (e) => {
    if(e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      const currentTag = e.target.innerText;

      tags[tagIndex] = currentTag;

      setBlog({ ...blog, tags });
      
      e.target.setAttribute("contentEditable", false);
    }
  }

  const handleAddEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  }

  return (
    <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10'>
      <p 
        className='outline-none'
        onKeyDown={handleTagEdit}
        onClick={handleAddEditable}
      >
        {tag}
      </p>
      <button 
        className='rounded-full absolute right-3 top-1/2 -translate-y-1/2'
        onClick={handleTagDelete}
      >
        <i className='fi fi-br-cross text-sm pointer-events-none' />
      </button>
    </div>
  )
}

export default Tags