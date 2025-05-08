// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Login from "./Component/login";
import Register from "./Component/register";
import UserDash from "./UserDashboard/UserDash";
import CreateBlog from "./UserDashboard/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./UserDashboard/EditBlog";
import ViewAllBlogs from "./UserDashboard/ViewAllBlogs";
import AdminDash from "./AdminDashboard/AdminDash";
import ManageAllBlogs from "./AdminDashboard/ManageAllBlogs";
import AdminEditBlog from "./AdminDashboard/AdminEditBlog";
import ManageUser from "./AdminDashboard/ManageUser";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/Userdashboard" element={<UserDash />} />
        <Route path="/Userdashboard/createblog" element={<CreateBlog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/Userdashboard/editblog/:id" element={<EditBlog />} />
        <Route path="/Userdashboard/viewallblogs" element={<ViewAllBlogs />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route
          path="/Admindashboard/viewallblogs"
          element={<ManageAllBlogs />}
        />
        <Route path="/admin/editblog/:id" element={<AdminEditBlog />} />
        <Route path="/Admindashboard/manageusers" element={<ManageUser />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
