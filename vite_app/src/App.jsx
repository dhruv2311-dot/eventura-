import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { DataProvider } from "./DataFetcher"; 
import './App.css';
import Homepage from "./homepage";
import Venue from "./venue";
import VenueDetails from "./VenueDetails"; 
import CategoryDetails from "./CategoryDetails"; 
import Blogs from "./blogs";
import BlogDetails from "./BlogDetails";
import Events from "./events";
import Contactus from "./contactus";
import Projects from "./projects";
import ProjectDetails from "./ProjectDetails"; 
import Profile from "./profilepage";
import Landingpage from "./landingpage";
import ProtectedRoute from "./ProtecedRoute";
import AboutUs from "./Aboutus";
import Authuser from "./Authuser";
import Discount from "./discount";
import Feedback from "./feedback";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <DataProvider>
      <Router>
        {isAuthenticated && <Authuser />}
        <Routes>
          {/* ✅ If user is logged in, redirect "/" to "/home" */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Landingpage />} />

          {/* ✅ Home Page - Protected */}
          <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />

          {/* ✅ Venue Routes */}
          <Route path="/venue" element={<ProtectedRoute><Venue /></ProtectedRoute>} />
          <Route path="/venue/:id" element={<ProtectedRoute><VenueDetails /></ProtectedRoute>} />

          {/* ✅ Category Routes */}
          <Route path="/category/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />

          {/* ✅ Other Routes */}
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} /> {/* ✅ Added Route for Project Details */}
          <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
          <Route path="/blog/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
          <Route path="/contactus" element={<ProtectedRoute><Contactus /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/aboutus" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path="/discounts" element={<ProtectedRoute><Discount /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />

          {/* ✅ 404 Page - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* ✅ ToastContainer added globally */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </DataProvider>
  );
}

export default App;
