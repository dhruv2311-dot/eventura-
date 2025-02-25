import React, { useState, useEffect } from 'react';
import Footer from './footer';
import './venues.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import loaderGif from './assets/loader.gif'; 
const Venue = () => {
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState(""); // Venue Name
  const [searchLocation, setSearchLocation] = useState(""); // Venue Location
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://eventura-2.onrender.com/venues")
      .then((response) => {
        setAllVenues(response.data);
        setFilteredVenues(response.data); // Show all venues by default
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching venues:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // 🔍 Handle Live Search for Both Inputs
  const handleLiveSearch = (type, value) => {
    if (type === "category") {
      setSearchCategory(value);
    } else if (type === "location") {
      setSearchLocation(value);
    }

    // Filter venues based on search inputs
    const filtered = allVenues.filter((venue) =>
      venue.name.toLowerCase().includes(searchCategory.toLowerCase()) &&
      venue.location.toLowerCase().includes(searchLocation.toLowerCase())
    );

    setFilteredVenues(filtered);
  };
  if (loading) {
    return (
      <div className="loader-container">
        <img src={loaderGif} alt="Loading..." className="loader" />
      </div>
    );
  }

  if (error) {
    return <h2 className="error">Error loading venues.</h2>;
  }
  return (
    <>
      <Navbar />

      {/* Hero Section */}
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
            <input
              type="text"
              placeholder="Search Venue Name"
              className="search-input"
              value={searchCategory}
              onChange={(e) => handleLiveSearch("category", e.target.value)}
            />
            <input
              type="text"
              placeholder="Search Location"
              className="search-input"
              value={searchLocation}
              onChange={(e) => handleLiveSearch("location", e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="venues-container">
        <h2>📍 All Venues</h2>
        <div className="venues-grid">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <div
                key={venue._id}
                className="venue-card"
                onClick={() => navigate(`/venue/${venue._id}`)}
              >
                <img src={venue.images?.[0]} alt={venue.name} className="venue-image" />
                <h3 className="venue-name">{venue.name}</h3>
                <p className="venue-location">📍 {venue.location}</p>
                <p className="venue-price">💰 ${venue.price_per_day} per day</p>
              </div>
            ))
          ) : (
            <p className="no-results">No venues found.</p>
          )}
        </div>
      </div>
      <div className="container">
        <img 
          src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTot0czju3Rw2f9QpIuhuZcKG2OHcDb5s6TYwtZ9QVRZqCOIJUn" 
          alt="Venue Image" 
          className="image" 
        />
        <div className="text-container">
          <h1 className="title">Perfect Venue, Memorable Events.</h1>
          <p className="description">
            Secure your event's stage, book the perfect venue today. Elevate your occasions with ease.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Venue;

