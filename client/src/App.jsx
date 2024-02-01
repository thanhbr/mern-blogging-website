import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";

const App = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navbar />}
      >
        <Route path="/sign-in" element={<UserAuthForm type="sign-in" />} />
        <Route path="/sign-up" element={<UserAuthForm type="sign-up" />} />
      </Route>

    </Routes>
  )
}

export default App;