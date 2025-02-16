import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import { FaHeart, FaUser, FaCalendarAlt, FaCreditCard, FaCog } from "react-icons/fa";
import proileimge from './assets/image.jpg'
import Footer from './footer';
const ProfilePage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={proileimge} alt="Profile" className="profile-pic" />
        <h2>{fullName}</h2>
        <p className="membership">Premium Member</p>
        <button className="edit-btn">Edit Profile</button>
        <ul className="sidebar-menu">
          <li><FaUser /> Personal Details</li>
          <li><FaCalendarAlt /> My Bookings</li>
          <li><FaHeart /> Saved Venues</li>
          <li><FaCreditCard /> Payment Details</li>
          <li><FaCog /> Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="section personal-details">
          <h3>Personal Details</h3>
          <div className="details-grid">
            <input type="text" placeholder="Enter your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Enter your phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="text" placeholder="Enter your location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>

        <div className="section upcoming-events">
          <h3>Upcoming Events</h3>
          <div className="event">
            <FaCalendarAlt className="event-icon" />
            <div>
              <h4>Tech Conference 2025</h4>
              <p>March 15, 2025 • 9:00 AM</p>
            </div>
          </div>
          <div className="event">
            <FaCalendarAlt className="event-icon" />
            <div>
              <h4>Digital Summit</h4>
              <p>April 2, 2025 • 10:30 AM</p>
            </div>
          </div>
        </div>

        <div className="section saved-venues">
          <h3>Saved Venues</h3>
          <div className="venue">
            <FaHeart className="venue-icon" />
            <div>
              <h4>Convention Center</h4>
              <p>123 Business Ave, New York</p>
            </div>
          </div>
          <div className="venue">
            <FaHeart className="venue-icon" />
            <div>
              <h4>Tech Hub</h4>
              <p>456 Innovation St, San Francisco</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ProfilePage;
