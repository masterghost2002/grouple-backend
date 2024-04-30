import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.page";
function App() {

  return (
    <Routes>
      <Route path="/sign-up" element={<LoginPage/>}/>
    </Routes>
  )
}

export default App
