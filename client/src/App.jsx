import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";

const App = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navbar />}
      >
        <Route path="/sign-in" element={<h1>Sign in page</h1>} />
        <Route path="/sign-up" element={<h1>Sign up page</h1>} />
      </Route>

    </Routes>
  )
}

export default App;