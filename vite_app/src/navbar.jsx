import React, { useState } from 'react';
import logo from './assets/eventura.png';
import { FiUser, FiMenu, FiX, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import ChatBox from './ChatBox';  // 🟢 Import ChatBox
import './navbar.css';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);  // 🟢 State for Chat

  const handleProfile = () => {
    navigate('/profile');
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <header className="eventura-header">
        <div className="logo-section">
          <img src={logo} alt="Eventura Logo" className="logo-image" />
        </div>
        
        {/* Hamburger Menu Button for Mobile */}
        <button className="hamburger-menu" onClick={toggleDrawer}>
          {isDrawerOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav">
          <Link to="/">HOME</Link>
          <Link to="/venue">VENUES</Link>
          <Link to="/events">EVENTS</Link>
          <Link to="/projects">PROJECTS</Link>
          <Link to="/blogs">BLOGS</Link>
          <Link to="/contactus">CONTACT US</Link>
          <Link to="/aboutus">ABOUT US</Link>
        </nav>

        {/* Desktop Right Section */}
        <div className="right-section desktop-right">
          <FiMessageSquare 
            className="icon1 chat-icon" 
            onClick={() => setShowChat(!showChat)} 
          />
          <FiUser className="icon1 profile-icon" onClick={handleProfile} />
          <select className="language-select">
            <option>ENGLISH</option>
          </select>
          {isAuthenticated && (
            <button
              className="logout-button"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Drawer */}
        <div className={`mobile-drawer ${isDrawerOpen ? 'active' : ''}`}>
          <nav className="mobile-nav-links">
            <Link to="/" onClick={toggleDrawer}>HOME</Link>
            <Link to="/venue" onClick={toggleDrawer}>VENUES</Link>
            <Link to="/events" onClick={toggleDrawer}>EVENTS</Link>
            <Link to="/projects" onClick={toggleDrawer}>PROJECTS</Link>
            <Link to="/blogs" onClick={toggleDrawer}>BLOGS</Link>
            <Link to="/contactus" onClick={toggleDrawer}>CONTACT US</Link>
            <Link to="/aboutus" onClick={toggleDrawer}>ABOUT US</Link>
          </nav>
          <div className="mobile-right-section">
            <div className="mobile-icon" onClick={handleProfile}>
              <FiUser className="icon1" /> Profile
            </div>
            <div className="mobile-icon" onClick={() => setShowChat(!showChat)}>
              <FiMessageSquare className="icon1" /> Live Chat
            </div>
            <select className="language-select">
              <option>ENGLISH</option>
            </select>
            {isAuthenticated && (
              <button
                className="logout-button"
                onClick={() => {
                  logout({ logoutParams: { returnTo: window.location.origin } });
                  setIsDrawerOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 🟢 Live Chat Box */}
      {showChat && <ChatBox />}
    </div>
  );
};

export default Navbar;
