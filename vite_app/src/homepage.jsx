import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "./DataFetcher"; // Importing data
import Navbar from "./navbar";
import Footer from "./footer";
import "./homepage.css";

const Homepage = () => {
  const { categories, venues, team, reviews, loading, error } = useData();
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchType, setSearchType] = useState(null); // "category" or "location"
  const navigate = useNavigate();

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <h2 className="error">Error fetching data</h2>;

  const handleBookNow = async (itemId, type) => {
    try {
      // Determine the API URL based on the type
      const apiUrl = type === 'category'
        ? `https://eventura-2.onrender.com/categories/${itemId}`
        : `https://eventura-2.onrender.com/venues/${itemId}`;

      // Fetch the full item details
      const response = await fetch(apiUrl);
      const item = await response.json();

      if (!response.ok || !item) {
        toast.error(`Failed to fetch ${type} details.`);
        return;
      }

      const bookingData = {
        userId: null, // Add userId if available
        eventId: type === "category" ? item._id : null,
        eventName: type === "category" ? item.name : null,
        venueId: type === "venue" ? item._id : null,
        venueName: type === "venue" ? item.name : null,
        date: null, // Add date if available
        status: "Pending", // Default status
      };

      // Save the booking in the database
      const saveResponse = await fetch("https://eventura-10.onrender.com/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const saveData = await saveResponse.json();

      if (saveResponse.ok) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} booking request sent successfully!`);

        // Store the booking in local storage for quick UI updates
        let existingBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
        existingBookings.push(bookingData);
        localStorage.setItem("myBookings", JSON.stringify(existingBookings));

        // Navigate to the booking page
        navigate(`/booking`);
      } else {
        console.error("Booking failed:", saveData);
        toast.error("Failed to send booking request.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      toast.error("Error while booking.");
    }
  };

  // 🔍 Handle Live Search
  const handleLiveSearch = (type, value) => {
    if (type === "category") {
      setSearchCategory(value);
      setSearchLocation(""); // Reset location search
      setFilteredCategories(
        categories.filter((category) =>
          category.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setSearchType(value ? "category" : null);
    } else if (type === "location") {
      setSearchLocation(value);
      setSearchCategory(""); // Reset category search
      setFilteredVenues(
        venues.filter((venue) =>
          venue.location.toLowerCase().includes(value.toLowerCase())
        )
      );
      setSearchType(value ? "location" : null);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="overlay">
          <h2 className="hero-title">Your Event, Our Expertise</h2>
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search Category"
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

      <div className="eventura-container">
        {/* 🎯 Show Structured Category Suggestions */}
        {searchType === "category" && searchCategory && (
          <>
            <h2 className="category">Search Results - Categories</h2>
            <div className="search-results-grid">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category._id} className="search-card">
                    <Link to={`/category/${category._id}`}>
                      <img
                        src={category.featured_images?.[0] || category.image_url}
                        alt={category.name}
                        className="search-image"
                      />
                      <div className="search-info">
                        <h3>{category.name}</h3>
                        <p>{category.description.substring(0, 80)}...</p>
                      </div>
                    </Link>
                    <button className="book-now-btn" onClick={() => handleBookNow(category._id, "category")}>
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-results">No categories found.</p>
              )}
            </div>
          </>
        )}

        {searchType === "location" && searchLocation && (
          <>
            <h2 className="venues">Search Results - Venues</h2>
            <div className="search-results-grid">
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <div key={venue._id} className="search-card">
                    <Link to={`/venue/${venue._id}`}>
                      <img
                        src={venue.images?.[0]}
                        alt={venue.name}
                        className="search-image"
                      />
                      <div className="search-info">
                        <h3>{venue.name}</h3>
                        <p><strong>Location:</strong> {venue.location}</p>
                        <p><strong>Price/Day:</strong> ${venue.price_per_day}</p>
                      </div>
                    </Link>
                    <button className="book-now-btn" onClick={() => handleBookNow(venue._id, "venue")}>
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-results">No venues found.</p>
              )}
            </div>
          </>
        )}

        {/* 🎉 Normal Category & Venue Sections */}
        {searchType === null && (
          <>
            <h2 className="category">Browse By Category</h2>
            <div className="categories-container">
              {categories.map((category) => (
                <div key={category._id} className="category-card">
                  <Link to={`/category/${category._id}`}>
                    <img
                      src={category.featured_images?.[0] || category.image_url}
                      alt={category.name}
                    />
                    <h2>{category.name}</h2>
                    <p>{category.description.substring(0, 60)}...</p>
                  </Link>
                  <button
                    className="book-now-btn"
                    onClick={() => handleBookNow(category._id, "category")}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>

            <h2 className="venues">Popular Venues</h2>
            <div className="venues-container">
              {venues.map((venue) => (
                <div key={venue._id} className="venue-card">
                  <Link to={`/venue/${venue._id}`}>
                    <img
                      src={venue.images?.[0]}
                      alt={venue.name}
                      className="venue-image"
                    />
                    <div className="venue-details">
                      <h3>{venue.name}</h3>
                      <p><strong>Location:</strong> {venue.location}</p>
                      <p><strong>Price/Day:</strong> ${venue.price_per_day}</p>
                    </div>
                  </Link>
                  <button
                    className="book-now-btn"
                    onClick={() => handleBookNow(venue._id, "venue")}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="start-event-wrapper">
          <div className="start-event-container">
            <img
              src="https://st2.depositphotos.com/3732989/5330/i/380/depositphotos_53302063-stock-photo-lets-start-text.jpg"
              alt="Let's Start"
              className="start-event-image"
            />
            <div className="start-event-content">
              <h2>Let’s Begin Crafting Your Event!</h2>
              <p>Let's kickstart your event journey today, turning your dreams into remarkable moments.</p>
            </div>
          </div>
        </div>

        <h2 className="team">MEET OUR TEAM AND ORGANIZERS</h2>
        <div className="team-wrapper">
          {team.map((member, index) => (
            <div className="team-card" key={index}>
              <img src={member.profile_image} alt={member.name} className="team-image" />
              <div className="team-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <p>{member.experience} of experience</p>
                <p>Email: {member.email}</p>
                <p>Phone: {member.phone}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Section */}
        <h2 className="reviews">Reviews</h2>
        <div className="review-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-avatar">{review.name.charAt(0)}</div>
              <div className="review-content">
                <h3>{review.name}</h3>
                <p>{review.comment}</p>
                <span>Rating: {review.rating} ⭐</span>
                <small>{review.event_type} - {new Date(review.review_date).toDateString()}</small>
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;