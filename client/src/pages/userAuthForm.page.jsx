import React, { useContext, useRef, useState } from 'react';
import InputBox from '../components/input.component';
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import { emailRegex, passwordRegex } from '../utils/regex';
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { SERVER_DOMAIN } from '../utils/config';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';

const UserAuthForm = ({ type }) => {
  const [debounceSubmit, setDebounceSubmit] = useState(true);
  const { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
  console.log('access_token', access_token);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios.post(`${SERVER_DOMAIN}/users/${serverRoute}`, formData)
          .then(({ data }) => {
            if(data?.status) {

              storeInSession("user", JSON.stringify(data?.data));
              setUserAuth(data?.data)

              toast.success(data?.message, { duration: 2000 });
            } else {
              toast.error((data?.message || "Error"), { duration: 2000 });
            }
          })
          .catch(({ response }) => {
            toast.error((response?.data?.message || "Error"), { duration: 2000 });
          });
  }
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if(debounceSubmit) {
      setDebounceSubmit(false);
      setTimeout(() => setDebounceSubmit(true), 2000);

      let serverRoute = type === "sign-in" ? "sign-in" : "sign-up"; 

      // form data
      const form = new FormData(formElement);
      let formData = {};

      for(let [key, value] of form.entries()) {
        formData[key] = value;
      }

      // form validation
      const { fullname, email, password } = formData;
      if(fullname) {
        if(fullname?.length < 3) {
          return toast.error("Fullname must be at least 3 letters long", { duration: 2000 });
        }
      }
      if(!email?.length) {
        return toast.error("Enter email", { duration: 2000 });
      }
      if(!emailRegex.test(email)) {
        return toast.error("Email is invalid", { duration: 2000 });
      }
      if(!passwordRegex.test(password)) {
        return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters", { duration: 2000 });
      }
      
      userAuthThroughServer(serverRoute, formData);
    }
  }

  return (
    access_token
     ? <Navigate to="/" />
     : 
      <AnimationWrapper keyValue={type}>
        <section className={"h-cover flex items-center justify-center"}>
          <Toaster />
          <form id="formElement" className="w-[80%] max-w-[400px]">
            <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
              {type  === "sign-in" ? "Welcome back" : "Join us today"}
            </h1>

            {type !== "sign-in" 
                ? <InputBox 
                    name="fullname"
                    type="text"
                    placeholder="Full name"
                    icon="fi-rr-user"
                  />
                : ""
            }
            <InputBox 
              name="email"
              type="email"
              placeholder="Email"
              icon="fi-rr-envelope"
            />
            <InputBox 
              name="password"
              type="password"
              placeholder="Password"
              icon="fi-rr-key"
            />
            <button
              className='btn-dark center mt-14'
              type='submit'
              onClick={handleSubmit}
            > 
              { type.replace("-", " ") }
            </button>

            <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
              <hr className='w-1/2 border-black' />
              <p>or</p>
              <hr className='w-1/2 border-black' />
            </div>

            <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
              <img 
                src={googleIcon}
                alt='google-icon'
                className='w-5'
              />
              continue with google
            </button>
            {
              type === "sign-in"
                ? <p className='mt-6 text-dark-grey text-xl text-center'>
                  Don't have an account?
                  <Link 
                    to="/sign-up"
                    className="underline text-black text-xl ml-1"
                  >
                    Join us today
                  </Link>
                </p>
                : <p className='mt-6 text-dark-grey text-xl text-center'>
                  Already a member ?
                  <Link 
                    to="/sign-in"
                    className="underline text-black text-xl ml-1"
                  >
                    Sign in here
                  </Link>
                </p>
            }

          </form>
        </section>
      </AnimationWrapper>
  )
}

export default UserAuthForm