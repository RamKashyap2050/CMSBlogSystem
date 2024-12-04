import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogPage from "./Pages/BlogPage";
import IndividualBlog from "./Pages/IndvidualBlog";
import VlogPage from "./Pages/VlogPage";
import logo from "./asitravel.jpg";
import About from "./Pages/About";
import Itinerary from "./Pages/Iternary";
import ItineraryDetail from "./Pages/IternaryDetail";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import UserProfile from "./Pages/UserProfile";
import LoginAdmin from "./Pages/LoginAdmin";
import AdminNewBlog from "./Pages/AdminNewBlog";
import AdminManageContent from "./Pages/AdminManageContent";
import AdminNewIternary from "./Pages/AdminNewIternary";
import AdminViewItinerary from "./Pages/AdminViewIternary";
import AdminViewSingleIternary from "./Pages/AdminViewSingleIternary";
import AdminViewSingleBlog from "./Pages/AdminViewSingleBlog";
import IndividualVlog from "./Pages/IndividualVlog";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/admincreateblog" element={<AdminNewBlog />} />
        <Route path="/adminmanageblogs" element={<AdminManageContent />} />
        <Route path="/admincreateiternary" element={<AdminNewIternary />} />
        <Route
          path="/adminmanageitineraries"
          element={<AdminViewItinerary />}
        />
        <Route
          path="/adminviewsingleitinerary/:id"
          element={<AdminViewSingleIternary />}
        />
        <Route
          path="/adminviewsingleblog/:id"
          element={<AdminViewSingleBlog />}
        />

        {/* User Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<BlogPage />} />
        <Route path="/vlogspage" element={<VlogPage />} />
        <Route path="/vlogs/:id" element={<IndividualVlog />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog/:id" element={<IndividualBlog />} />
        <Route path="/iternary" element={<Itinerary />} />
        <Route path="/itinerary/:id" element={<ItineraryDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
