import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Navbar from './navbar';
import Footer from './footer';
import './SavedVenues.css'; // New CSS file for this page
import { toast } from "react-toastify";

const SavedVenues = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [savedVenues, setSavedVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchSavedVenues();
    }
  }, [isAuthenticated, user]);

  const fetchSavedVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://eventura-11.onrender.com/users/${user.sub}/saved-venues`);
      const venueIds = response.data.savedVenues || [];
      const venueDetails = await Promise.all(
        venueIds.map((id) =>
          axios.get(`https://eventura-11.onrender.com/venues/${id}`).then((res) => res.data)
        )
      );
      setSavedVenues(venueDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching saved venues:", error);
      setError("Failed to load saved venues.");
      setLoading(false);
      toast.error("Failed to load saved venues.");
    }
  };

  const handleRemoveVenue = async (venueId) => {
    try {
      const response = await axios.post(`https://eventura-11.onrender.com/users/${user.sub}/saved-venues`, {
        venueId,
        action: "remove",
      });

      if (response.status === 200) {
        setSavedVenues(savedVenues.filter((venue) => venue._id !== venueId));
        toast.success("Venue removed from saved list!");
      }
    } catch (error) {
      console.error("Error removing venue:", error);
      toast.error("Failed to remove venue.");
    }
  };

  const handleViewDetails = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading your saved venues...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h2>Please log in to view your saved venues.</h2>
        <button onClick={() => navigate("/login")}>Log In</button>
      </div>
    );
  }

  if (error) {
    return <h2 className="error">{error}</h2>;
  }

  return (
    <>
      <Navbar />
      <section className="saved-venues-hero">
        <div className="hero-overlay">
          <h1>Your Saved Venues</h1>
          <p>Explore and manage your favorite event spaces.</p>
        </div>
      </section>

      <div className="saved-venues-container">
        {savedVenues.length > 0 ? (
          <div className="saved-venues-grid">
            {savedVenues.map((venue) => (
              <div key={venue._id} className="saved-venue-card">
                <img
                  src={venue.images?.[0] || "https://via.placeholder.com/300"}
                  alt={venue.name}
                  className="saved-venue-image"
                />
                <div className="saved-venue-info">
                  <h3>{venue.name}</h3>
                  <p className="location">📍 {venue.location}</p>
                  <p className="price">💰 ${venue.price_per_day} / day</p>
                  <div className="saved-venue-actions">
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetails(venue._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveVenue(venue._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-saved-venues">
            <h2>No Saved Venues Yet</h2>
            <p>Start saving your favorite venues from the Venues page!</p>
            <button onClick={() => navigate("/venues")}>Explore Venues</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SavedVenues;