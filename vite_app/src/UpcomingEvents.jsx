import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Navbar from './navbar';
import Footer from './footer';
import './upcomingEvents.css';
import { toast } from "react-toastify";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Track the event for popup

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      console.log("Fetching events for user:", user.sub);
      fetchUpcomingEvents();
    }
  }, [isAuthenticated, user]);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/upcomingevents');
      console.log("Events fetched:", response.data);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching upcoming events:", error.response?.data || error.message);
      setError(" stavFailed to load upcoming events.");
      setLoading(false);
      toast.error("Failed to load upcoming events.");
    }
  };

  const openEventPopup = (event) => {
    setSelectedEvent(event);
  };

  const closeEventPopup = () => {
    setSelectedEvent(null);
  };

  if (authLoading || loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading upcoming events...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h2>Please log in to view your upcoming events.</h2>
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
      <section className="upcoming-events-hero">
        <div className="hero-overlay">
          <h1>Upcoming Events</h1>
          <p>Discover exciting events happening soon!</p>
        </div>
      </section>

      <div className="upcoming-events-container">
        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div
                key={event._id}
                className="event-card"
                onClick={() => openEventPopup(event)}
              >
                <img
                  src={event.image || "https://via.placeholder.com/300"}
                  alt={event.title}
                  className="event-image"
                />
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="date">
                    📅 {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="location">📍 {event.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <h2>No Upcoming Events</h2>
            <p>Check back later for exciting events!</p>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {selectedEvent && (
        <div className="event-popup-overlay" onClick={closeEventPopup}>
          <div className="event-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeEventPopup}>✖</button>
            <img
              src={selectedEvent.image || "https://via.placeholder.com/400"}
              alt={selectedEvent.title}
              className="popup-image"
            />
            <div className="popup-details">
              <h2>{selectedEvent.title}</h2>
              <p className="date">
                📅 {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="location">📍 {selectedEvent.location}</p>
              <p className="description">{selectedEvent.description}</p>
              <p className="organizer">👤 Organized by: {selectedEvent.organizer}</p>
              <p className="category">🏷️ Category: {selectedEvent.category}</p>
              <p className="price">💰 Ticket Price: ₹{selectedEvent.ticketPrice}</p>
              <p className="duration">⏳ Duration: {selectedEvent.duration}</p>
              <p className="capacity">👥 Capacity: {selectedEvent.capacity}</p>
              <button className="book-now-btn2">Book Now</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default UpcomingEvents;