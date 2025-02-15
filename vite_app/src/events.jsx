import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { FaWhatsapp, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import './events.css';
import Footer from './footer'
import Navbar from './Navbar';

const Events = () => {
  const navigate = useNavigate();


  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [eventData, setEventData] = useState({
    source_language: "English",
    event_name: "",
    event_type: "location_based",
    location: "",
    online_url: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleEventTypeChange = (type) => {
    setEventData({ ...eventData, event_type: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://eventura-5.onrender.com/events", eventData);
      alert("Event created successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const handleCancel = () => {
    navigate("/events");
  };

  const handleSearch = () => {
    navigate(`/events?category=${category}&location=${location}`);
  };

  return (
    <>
    <Navbar />
      <div className="events-container">
        <div className="events-banner">
          <h1 className="events-title">EVENTS</h1>
          <div className="search-bar">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <FaSearch size={18} className="search-icon" />
            </div>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <FaSearch size={18} className="search-icon" />
            </div>
            <button className="search-button3" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="event-form-container">
        <h2 className='events'>Create Event</h2>
        <form onSubmit={handleSubmit}>


          <div className="form-section">
            <label>Source Language</label>
            <input type="text" name="source_language" value={eventData.source_language} readOnly />

            <label>Event Name</label>
            <input type="text" name="event_name" value={eventData.event_name} onChange={handleChange} required />
          </div>


          <div className="form-section">
            <label>Event Type</label>
            <div className="event-type-buttons">
              <button type="button" className={eventData.event_type === "location_based" ? "active" : ""}
                onClick={() => handleEventTypeChange("location_based")}>Location Based</button>
              <button type="button" className={eventData.event_type === "online_event" ? "active" : ""}
                onClick={() => handleEventTypeChange("online_event")}>Online Event</button>
              <button type="button" className={eventData.event_type === "hybrid_event" ? "active" : ""}
                onClick={() => handleEventTypeChange("hybrid_event")}>Hybrid Event</button>
            </div>

            {["location_based", "hybrid_event"].includes(eventData.event_type) && (
              <>
                <label>Location</label>
                <input type="text" name="location" value={eventData.location} onChange={handleChange} required />
              </>
            )}

            {["online_event", "hybrid_event"].includes(eventData.event_type) && (
              <>
                <label>Online URL</label>
                <input type="text" name="online_url" value={eventData.online_url} onChange={handleChange} required />
              </>
            )}
          </div>


          <div className="form-section">
            <label>Start Date</label>
            <input type="date" name="start_date" value={eventData.start_date} onChange={handleChange} required />

            <label>End Date</label>
            <input type="date" name="end_date" value={eventData.end_date} onChange={handleChange} required />

            <label>Start Time</label>
            <input type="time" name="start_time" value={eventData.start_time} onChange={handleChange} required />

            <label>End Time</label>
            <input type="time" name="end_time" value={eventData.end_time} onChange={handleChange} required />
          </div>


          <div className="form-actions">
            <button type="submit" className="submit-button">Create Event</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
      <div className="event-card">
        <img src="https://disturbedechoes.com/images/thejourney/thejourney.jpg" alt="Event" className="event-image" />
        <div className="event-text">
          <h2>
            Create Your<span className="comma">,</span> <b>Memorable Events.</b>
          </h2>
          <p>
            Create Your Vision, Craft Memorable Events. Unleash Creativity,
            Celebrate Memorable Events
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Events;
