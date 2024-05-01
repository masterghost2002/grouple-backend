import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.page";
import HomePage from "./pages/home.page";
import SignUpPage from "./pages/signup.page";
import BookTicketPage from "./pages/book-ticket.page";
import AllTicketsPage from "./pages/all-tickets.page";
import ProfilePage from "./pages/profile.page";
import { Toaster } from "react-hot-toast";
function App() {

  return (
    <>
    <Toaster/>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/sign-in" element={<LoginPage/>}/>
      <Route path="/sign-up" element={<SignUpPage/>}/>
      <Route path="/profile" element={<ProfilePage/>}/>
      <Route path="/book-ticket/:id" element={<BookTicketPage/>}/>
      <Route path="/all-tickets" element={<AllTicketsPage/>}/>
    </Routes>
    </>
  )
}

export default App
