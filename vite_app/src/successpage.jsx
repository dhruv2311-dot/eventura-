import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './navbar';
import Footer from './footer';
import './BookingPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="success-page">
        <h2>Payment Successful!</h2>
        <p>Your booking has been confirmed.</p>
        <button onClick={() => navigate('/homepage')} className="home-btn">
          Back to Homepage
        </button>
      </div>
      <Footer />
    </>
  );
};

export default SuccessPage;