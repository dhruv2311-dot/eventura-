import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchUpcomingEvents();
    }
  }, [isAuthenticated, user]);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/upcomingevents');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching upcoming events:", error.response?.data || error.message);
      setError("Failed to load upcoming events.");
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
        <motion.div
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p>Loading upcoming events...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h2>Please log in to view your upcoming events.</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
        >
          Log In
        </motion.button>
      </div>
    );
  }

  if (error) {
    return <h2 className="error">{error}</h2>;
  }

  return (
    <>
      <Navbar />
      <motion.section
        className="upcoming-events-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-overlay">
          <h1>Upcoming Events</h1>
          <p>Explore exciting events happening soon!</p>
        </div>
      </motion.section>

      <div className="upcoming-events-container">
        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <motion.div
                key={event._id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEventPopup(event)}
              >
                <img
                  src={event.image || "https://via.placeholder.com/300"}
                  alt={event.title}
                  className="event-image"
                />
                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-details-preview">
                    <p className="event-date">
                      <span className="icon">📅</span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="event-location">
                      <span className="icon">📍</span>
                      {event.location}
                    </p>
                  </div>
                </div>
              </motion.div>
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
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="event-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeEventPopup}
          >
            <motion.div
              className="event-popup"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="close-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeEventPopup}
              >
                ✖
              </motion.button>
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
                <motion.button
                  className="book-now-btn2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default UpcomingEvents;