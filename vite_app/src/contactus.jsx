import React, { useState } from "react";
import axios from "axios";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import "./ContactUs.css";
import Navbar from './navbar';
import Footer from './footer';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://eventura-6.onrender.com/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <>
    <Navbar />
    <div className="contact-container">
      <div className="hero-section5">
        <div className="overlay5">
          <h2>Get in Touch with Us</h2>
          <p>We're here to help plan your perfect event</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-form">
          <h3>Send Us a Message</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-info">
          <h3>Contact Information</h3>
          <p><FiMapPin /> 123 Event Street, New York, NY 10001</p>
          <p><FiPhone /> +1 (555) 123-4567</p>
          <p><FiMail /> contact@eventura.com</p>
          <p><FiClock /> Mon - Fri: 9:00 AM - 6:00 PM</p>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.4166637443384!2d-73.98695192347469!3d40.758895334299175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855af6d68ab%3A0x9d8e7d3f368e3b2a!2sTimes%20Square%2C%20New%20York%2C%20NY%2010036!5e0!3m2!1sen!2sus!4v1708101234567!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>

          <div className="social-links">
            <h4>Follow Us</h4>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </div>4
    <Footer />
    </>
  );
};

export default ContactUs;
