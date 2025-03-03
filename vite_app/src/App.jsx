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
import Booking from "./BookingPage";

function App() {
  const { user, isAuthenticated } = useAuth0();
  const userId = user?.sub; // ✅ Auth0 se userId le raha hai

  return (
    <DataProvider>
      <Router>
        {isAuthenticated && <Authuser />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Landingpage />} />
          <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/venue" element={<ProtectedRoute><Venue /></ProtectedRoute>} />
          <Route path="/venue/:id" element={<ProtectedRoute><VenueDetails /></ProtectedRoute>} />
          <Route path="/category/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
          <Route path="/blog/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
          <Route path="/contactus" element={<ProtectedRoute><Contactus /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/aboutus" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path="/discounts" element={<ProtectedRoute><Discount /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          
          {/* ✅ BookingPage me userId pass kar raha hu */}
          <Route path="/booking" element={<ProtectedRoute><Booking userId={userId} /></ProtectedRoute>} /> 

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </DataProvider>
  );
}

export default App;
