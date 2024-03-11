import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { Navigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import Loader from '../components/loader.component';
import { sendRequest } from '../utils/api';

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {  } }
};

export const EditorContext = createContext({  });

const Editor = () => {

  const { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  const { userAuth: { access_token } } = useContext(UserContext);
  const fetchDetailBlog = async () => {
    try {
      const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/detail`, { blog_id, draft: true, mode: "edit" });
  
      if(response?.data?.status) {
        setBlog(response?.data?.data);
        setLoading(false);
      }
      
    } catch (error) {
      setBlog(null);
      setLoading(false);
      console.error('error', error);
    } 
  }


  useEffect(() => {
    if(!blog_id) {
      return setLoading(false);
    }
    fetchDetailBlog();

  }, [])

  return (
    <EditorContext.Provider 
      value={{ 
        blog, 
        setBlog, 
        editorState, 
        setEditorState,
        textEditor,
        setTextEditor
      }}
    >
      {
        access_token === null 
          ? <Navigate to="/sign-in" />
          : loading 
            ? <Loader /> 
            : editorState === "editor" 
                ? <BlogEditor />
                : <PublishForm />
      }
    </EditorContext.Provider>
  )
}

export default Editor