import React, { useState, useEffect } from 'react';
import './venues.css';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import axios from 'axios';

const Venue = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [allVenues, setAllVenues] = useState([]);
  const [topVenues, setTopVenues] = useState([]);

  const filters = [
    { label: 'No. of Guests', options: ['50-100', '100-200', '200-500', '500+'] },
    { label: 'Venue Type', options: ['Banquet Hall', 'Outdoor', 'Conference Room', 'Resort'] },
    { label: 'Space Preference', options: ['Indoor', 'Outdoor', 'Both'] },
    { label: 'Rating', options: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'] }
  ];

  useEffect(() => {
    axios
      .get("https://eventura-2.onrender.com/venues")
      .then((response) => {
        setAllVenues(response.data);
        setTopVenues(response.data.slice(0, 4));
      })
      .catch((error) => console.error("Error fetching venues:", error));
  }, []);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const selectOption = (filterLabel, option) => {
    setSelectedOptions((prev) => ({ ...prev, [filterLabel]: option }));
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      category,
      location,
      ...selectedOptions,
    }).toString();

    navigate(`/venues?${queryParams}`);
  };

  return (
    <div>
      <section
        className="hero-section-2"
        style={{
          backgroundImage:
            "url('https://i0.wp.com/suessmoments.com/wp-content/uploads/sites/10014/2023/02/website-shadowbrook-nj-wedding-photos-7153-photography-by-SUESS-MOMENTS.jpg?ssl=1')",
        }}
      >
        <div className="overlay2">
          <h2 className="hero-title2">OUR VENUES</h2>
          <div className="search-filters2">
            <div className="search-box2">
              <input
                type="text"
                placeholder="Search Category"
                className="search-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="search-box2">
              <input
                type="text"
                placeholder="Search Location"
                className="search-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button className="search-button2" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="filter-container">
        {filters.map((filter, index) => (
          <div className="dropdown" key={index}>
            <button className="dropdown-btn" onClick={() => toggleDropdown(filter.label)}>
              {selectedOptions[filter.label] || filter.label} <span>&#x25BC;</span>
            </button>
            {openDropdown === filter.label && (
              <div className="dropdown-content">
                {filter.options.map((option, idx) => (
                  <button key={idx} className="dropdown-option" onClick={() => selectOption(filter.label, option)}>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>


      <div className="venues-container">
        <h2>📍 All Venues</h2>
        <div className="venues-grid">
          {allVenues.map((venue, index) => (
            <div key={index} className="venue-card">
              <img src={venue.images[0]} alt={venue.name} className="venue-image" />
              <h3 className="venue-name">{venue.name}</h3>
              <p className="venue-location">📍 {venue.location}</p>
              <p className="venue-capacity">👥 Up to {venue.capacity} Guests</p>
              <p className="venue-price">💰 ${venue.price_per_day} per day</p>
            </div>
          ))}
        </div>
      </div>


      <div className="container">
        <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTot0czju3Rw2f9QpIuhuZcKG2OHcDb5s6TYwtZ9QVRZqCOIJUn" alt="Venue Image" className="image" />
        <div className="text-container">
          <h1 className="title">Perfect Venue, Memorable Events.</h1>
          <p className="description">
            Secure your event's stage, book the perfect venue today. Elevate your occasions with ease.
          </p>
        </div>
      </div>



      <div className="venues-container">
        <h2>🎉 Personalized Recommendation</h2>
        <div className="venues-grid">
          {topVenues.map((venue, index) => (
            <div key={index} className="venue-card">
              <img src={venue.images[0]} alt={venue.name} className="venue-image" />
              <h3 className="venue-name">{venue.name}</h3>
              <p className="venue-location">📍 {venue.location}</p>
              <p className="venue-capacity">👥 Up to {venue.capacity} Guests</p>
              <p className="venue-price">💰 ${venue.price_per_day} per day</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="footer1">
        <div className="footer-section1">
          <h4>FIND AN EVENT</h4>
          <p>BECOME A MEMBER</p>
          <p>Send Us Feedback</p>
          <p>SPECIAL DISCOUNTS</p>
        </div>
        <div className="footer-section1">
          <h4>GET HELP</h4>
          <p>Your Status</p>
          <p>Query</p>
          <p>Policies</p>
          <p>Payment Option</p>
          <p>Contact Us</p>
          <p>Refunds</p>
        </div>
        <div className="footer-section1">
          <h4>ABOUT US</h4>
          <p>News</p>
          <p>Careers</p>
          <p>Investors</p>
          <p>Sustainability</p>
        </div>
        <div className="footer-section1">
          <h4>Connect with Us</h4>
          <div className="social-icons1">
            <FaWhatsapp className="icon1" />
            <FaInstagram className="icon1" />
            <FaTwitter className="icon1" />
            <FaFacebookF className="icon1" />
          </div>
        </div>
        <div className="footer-bottom1">
          <span>📍 India</span>
          <span>2023 Inc, All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default Venue;
