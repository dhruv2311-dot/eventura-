import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleDiscount = () => {
    navigate('/discounts');
  };
  const handlecontactus= () => {
    navigate('/contactus');
  };
  const handleFeedback = () => {
    navigate('/feedback');
  };
 
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>FIND AN EVENT</h4>
        <p>BECOME A MEMBER</p>
        <p onClick={handleFeedback}>Send Us Feedback</p>
        <p onClick={handleDiscount}>SPECIAL DISCOUNTS</p>
      </div>
      <div className="footer-section">
        <h4>GET HELP</h4>
        <p>Your Status</p>
        <p  >Query</p>
        <p>Policies</p>
        <p>Payment Option</p>
        <p onClick={handlecontactus}>Contact Us</p>
        <p>Refunds</p>
      </div>
      <div className="footer-section">
        <h4>ABOUT US</h4>
        <p>News</p>
        <p>Careers</p>
        <p>Investors</p>
        <p>Sustainability</p>
      </div>
      <div className="footer-section">
        <h4>Connect with Us</h4>
        <div className="social-icons">
          <FaWhatsapp className="icon2" />
          <FaInstagram className="icon2" />
          <FaTwitter className="icon2" />
          <FaFacebookF className="icon2" />
        </div>
      </div>
      <div className="footer-bottom">
        <span>📍 India</span> 
        <span>2023 Inc, All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
