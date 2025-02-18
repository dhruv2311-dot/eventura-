import React from "react";
import { FaLightbulb, FaUsers, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import "./AboutUs.css";
import Founder from './assets/image.jpg'

const About = () => {
  return (
    <div className="about-container">
      {/* Top Banner Section */}
      <motion.div
        className="top-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="banner-content">
          <h2>About Eventura</h2>
          <p>Your perfect event, our expertise.</p>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="features-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="feature-card">
          <FaLightbulb className="icon" />
          <h3>Creative Solutions</h3>
          <p>Innovative approaches to transform your event into a remarkable experience.</p>
        </div>
        <div className="feature-card">
          <FaUsers className="icon" />
          <h3>Expert Team</h3>
          <p>Dedicated professionals committed to making your vision a reality.</p>
        </div>
        <div className="feature-card">
          <FaChartLine className="icon" />
          <h3>Growth Focus</h3>
          <p>Strategic insights to scale your events and maximize impact.</p>
        </div>
      </motion.div>

      {/* Mission Section with Image */}
      <motion.div
        className="mission-section"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="mission-content">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>We aim to revolutionize the event management industry by delivering innovative solutions that empower organizers and budget efficiency.</p>
            <div className="stats">
              <h3>500+</h3>
              <p>Events Completed</p>
              <h3>98%</h3>
              <p>Client Satisfaction</p>
            </div>
          </div>
          <img src="https://novobliss.in/wp-content/uploads/2021/09/Mission.jpg" alt="Mission" className="mission-image" />
        </div>
      </motion.div>

      {/* Vision Section */}
      <motion.div
        className="vision-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2>Our Vision</h2>
        <p>To be the global leader in innovative event solutions, setting new standards for excellence and creativity.</p>
        <div className="vision-cards">
          <div className="vision-card">
            <FaLightbulb className="icon" />
            <h3>Innovation First</h3>
            <p>Pioneering new techniques and approaches for impactful events.</p>
          </div>
          <div className="vision-card">
            <FaUsers className="icon" />
            <h3>Global Impact</h3>
            <p>Creating extraordinary experiences that resonate beyond borders.</p>
          </div>
          <div className="vision-card">
            <FaChartLine className="icon" />
            <h3>Future Ready</h3>
            <p>Preparing tomorrow’s challenges with today’s expertise.</p>
          </div>
        </div>
      </motion.div>

      {/* Founder Section */}
      <motion.div
        className="founder-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <img src={Founder} alt="Founder" className="founder-image" />
        <div className="founder-text">
          <h2>Dhruv Sonagra</h2>
          <h4>Founder & CEO</h4>
          <p>With years of experience in event management and technology, John has transformed the industry by introducing innovative and efficient solutions.</p>
          <button className="read-more">Read Full Story</button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;

