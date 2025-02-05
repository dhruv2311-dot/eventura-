import React from 'react'
import { FaWhatsapp, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import './footer.css'
const footer = () => {
  return (
    <div>
       <footer className="footer">
      <div className="footer-section">
        <h4>FIND AN EVENT</h4>
        <p>BECOME A MEMBER</p>
        <p>Send Us Feedback</p>
        <p>SPECIAL DISCOUNTS</p>
      </div>
      <div className="footer-section">
        <h4>GET HELP</h4>
        <p>Your Status</p>
        <p>Query</p>
        <p>Policies</p>
        <p>Payment Option</p>
        <p>Contact Us</p>
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
          <FaWhatsapp className="icon" />
          <FaInstagram className="icon" />
          <FaTwitter className="icon" />
          <FaFacebookF className="icon" />
        </div>
      </div>
      <div className="footer-bottom">
        <span>📍 India</span> 
        <span>2023 Inc, All Rights Reserved</span>
      </div>
    </footer>
    </div>
  )
}

export default footer
