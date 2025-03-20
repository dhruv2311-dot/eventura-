import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './navbar';
import Footer from './footer';
import './BookingPage.css';

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="cancel-page">
        <h2>Payment Cancelled</h2>
        <p>Your payment was not processed.</p>
        <button onClick={() => navigate('/homepage')} className="home-btn">
          Back to Homepage
        </button>
      </div>
      <Footer />
    </>
  );
};

export default CancelPage;