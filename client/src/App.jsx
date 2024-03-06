import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const userInSession = lookInSession("user");
    setUserAuth(userInSession ? JSON.parse(userInSession) : { access_token: null });

  }, [])

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Navbar />} >
          <Route index element={<HomePage />} />
          <Route path="/sign-in" element={<UserAuthForm type="sign-in" />} />
          <Route path="/sign-up" element={<UserAuthForm type="sign-up" />} />
          <Route path="/search/:query" element={<SearchPage />} />
        </Route>

      </Routes>
    </UserContext.Provider>
  )
}

export default App;