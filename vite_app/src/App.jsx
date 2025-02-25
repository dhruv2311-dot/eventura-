import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS import
import { DataProvider } from "./DataFetcher"; // Centralized Data Provider

import Homepage from "./homepage";
import Venue from "./venue";
import VenueDetails from "./VenueDetails"; // Venue Detail Page
import CategoryDetails from "./CategoryDetails"; // Category Detail Page
import Blogs from "./Blogs";
import Events from "./events";
import Contactus from "./Contactus";
import Projects from "./projects";
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
          <Route path="/" element={<Landingpage />} />
          <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />

          {/* ✅ Venue Routes */}
          <Route path="/venue" element={<ProtectedRoute><Venue /></ProtectedRoute>} />
          <Route path="/venue/:id" element={<ProtectedRoute><VenueDetails /></ProtectedRoute>} />

          {/* ✅ Category Routes */}
          <Route path="/category/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />

          {/* ✅ Other Routes */}
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
          <Route path="/contactus" element={<ProtectedRoute><Contactus /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/aboutus" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path="/discounts" element={<ProtectedRoute><Discount /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        </Routes>

        {/* ✅ ToastContainer added globally */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </DataProvider>
  );
}

export default App;
