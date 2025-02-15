import React from 'react'
import logo from './assets/eventura.png';
import { FiSearch, FiUser } from 'react-icons/fi';
import {Link} from 'react-router-dom'
import './navbar.css'
import { useNavigate } from 'react-router-dom';
const navbar = () => {
  const navigate = useNavigate();
  const handleprofile=()=>{
    navigate('/profile')
  }
  return (
    <div>
      <header className="eventura-header">
        <div className="logo-section">
          <img src={logo} alt="Eventura Logo" className="logo-image" />
        </div>
        <nav className="nav-links">
          {/* <a href="#" className="active">HOME</a>
          <a href="#">VENUES</a>
          <a href="#">EVENTS</a>
          <a href="#">PROJECTS</a>
          <a href="#">BLOGS</a>
          <a href="#">CONTACT US</a> */}

            <Link to="/" >HOME</Link>
            <Link to="/venue">VENUES</Link>
            <Link to="/events">EVENTS</Link>
            <Link to="/projects">PROJECTS</Link>
            <Link to="/blogs">BLOGS</Link>
            <Link to="/contact-us">CONTACT US</Link>

        </nav>
        <div className="right-section">
          <FiSearch className="icon search-icon" />
          <FiUser className="icon profile-icon" onClick={handleprofile} />
          <select className="language-select">
            <option>ENGLISH</option>
          </select>
          <button className="talk-button">Let's Talk</button>
        </div>
      </header>

    </div>
  )
}

export default navbar
