import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "./DataFetcher"; // Importing data
import { useAuth0 } from "@auth0/auth0-react"; // Add Auth0
import axios from "axios"; // Add axios for API calls
import Navbar from "./navbar";
import Footer from "./footer";
import "./homepage.css";
import { toast } from "react-toastify";

const Homepage = () => {
  const { categories, venues, team, reviews, loading, error } = useData();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchType, setSearchType] = useState(null); // "category" or "location"
  const [savedVenues, setSavedVenues] = useState([]); // State for saved venues
  const navigate = useNavigate();

  // Fetch saved venues when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchSavedVenues();
    }
  }, [isAuthenticated, user]);

  const fetchSavedVenues = async () => {
    try {
      const response = await axios.get(`https://eventura-11.onrender.com/users/${user.sub}/saved-venues`);
      setSavedVenues(response.data.savedVenues || []);
    } catch (error) {
      console.error("Error fetching saved venues:", error);
      toast.error("Failed to load saved venues.");
    }
  };

  // Handle saving/unsaving venues
  const handleSaveVenue = async (venueId) => {
    if (!isAuthenticated || !user?.sub) {
      toast.error("Please log in to save venues.");
      navigate("/login");
      return;
    }

    const isSaved = savedVenues.includes(venueId);
    try {
      const response = await axios.post(`https://eventura-11.onrender.com/users/${user.sub}/saved-venues`, {
        venueId,
        action: isSaved ? "remove" : "add",
      });

      if (response.status === 200) {
        if (isSaved) {
          setSavedVenues(savedVenues.filter((id) => id !== venueId));
          toast.success("Venue removed from saved list!");
        } else {
          setSavedVenues([...savedVenues, venueId]);
          toast.success("Venue saved successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving venue:", error.response?.data || error.message);
      toast.error("Failed to save venue.");
    }
  };

  // Handle loading states
  if (authLoading || loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <h2 className="error">Error fetching data</h2>;

  const handleBookNow = async (itemId, type) => {
    try {
      if (!isAuthenticated || !user?.sub) {
        toast.error("Please log in to book.");
        navigate("/login");
        return;
      }

      const apiUrl =
        type === "category"
          ? `https://eventura-2.onrender.com/categories/${itemId}`
          : `https://eventura-2.onrender.com/venues/${itemId}`;

      const response = await fetch(apiUrl);
      const item = await response.json();
      if (!response.ok || !item) {
        toast.error(`Failed to fetch ${type} details.`);
        return;
      }

      const bookingData = {
        userId: user.sub,
        title: item.name,
        image: type === "category" ? item.featured_images?.[0] || item.image_url : item.images?.[0],
        description: item.description || "No description available",
        price: item.price_per_day || 50,
        type: type === "category" ? "event" : "venue",
        eventId: type === "category" ? item._id : null,
        venueId: type === "venue" ? item._id : null,
        status: "Pending",
      };

      const saveResponse = await fetch("https://eventura-10.onrender.com/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (saveResponse.ok) {
        toast.success("Booking request sent successfully!");
        navigate("/booking");
      } else {
        const errorData = await saveResponse.json();
        toast.error(`Failed to send booking request: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Error while booking.");
    }
  };

  const handleLiveSearch = (type, value) => {
    if (type === "category") {
      setSearchCategory(value);
      setSearchLocation("");
      setFilteredCategories(
        categories.filter((category) =>
          category.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setSearchType(value ? "category" : null);
    } else {
      setSearchLocation(value);
      setSearchCategory("");
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
                    <Link to={`/category/${category._id}`} className="search-card-link">
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
                    <button
                      className="book-now-btn"
                      onClick={() => handleBookNow(category._id, "category")}
                    >
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
                    <Link to={`/venue/${venue._id}`} className="search-card-link">
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
                    <button
                      className="book-now-btn"
                      onClick={() => handleBookNow(venue._id, "venue")}
                    >
                      Book Now
                    </button>
                    <span
                      className={`heart-icon ${savedVenues.includes(venue._id) ? "saved" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the Link
                        handleSaveVenue(venue._id);
                      }}
                    >
                      {savedVenues.includes(venue._id) ? "❤️" : "🤍"}
                    </span>
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
                  <Link to={`/category/${category._id}`} className="category-card-link">
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
                  <Link to={`/venue/${venue._id}`} className="venue-card-link">
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
                  <span
                    className={`heart-icon ${savedVenues.includes(venue._id) ? "saved" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the Link
                      handleSaveVenue(venue._id);
                    }}
                  >
                    {savedVenues.includes(venue._id) ? "❤️" : "🤍"}
                  </span>
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
              <p>
                Let's kickstart your event journey today, turning your dreams into remarkable moments.
              </p>
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
                <small>
                  {review.event_type} - {new Date(review.review_date).toDateString()}
                </small>
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