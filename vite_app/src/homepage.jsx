import React, { useState, useEffect } from 'react';
import logo from './assets/eventura.png';
import { FiSearch, FiUser } from 'react-icons/fi';
import './homepage.css';

const API_BASE_URL = 'https://eventura-2.onrender.com/categories';

const Homepage = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    fetch(API_BASE_URL)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div className="eventura-container">
      <header className="eventura-header">
        <div className="logo-section">
          <img src={logo} alt="Eventura Logo" className="logo-image" />
        </div>
        <nav className="nav-links">
          <a href="#" className="active">HOME</a>
          <a href="#">VENUES</a>
          <a href="#">EVENTS</a>
          <a href="#">PROJECTS</a>
          <a href="#">BLOGS</a>
          <a href="#">CONTACT US</a>
        </nav>
        <div className="right-section">
          <FiSearch className="icon search-icon" />
          <FiUser className="icon profile-icon" />
          <select className="language-select">
            <option>ENGLISH</option>
          </select>
          <button className="talk-button">Let's Talk</button>
        </div>
      </header>

      <section className="hero-section">
        <div className="overlay">
          <h2 className="hero-title">Your Event, Our Expertise</h2>
          <div className="search-filters">
            <input type="text" placeholder="Search Category" className="search-input" />
            <input type="text" placeholder="Search Location" className="search-input" />
            <button className="search-button">Search</button>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Browse By Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <img src={category.imageUrl} alt={category.name} className="category-image" />
              <h3 className="category-title">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
