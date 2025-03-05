import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; 
import "./profile.css";
import { FaHeart, FaUser, FaCalendarAlt, FaRegCalendarCheck, FaCog } from "react-icons/fa";
import Footer from './footer';
import Navbar from "./navbar";


const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0(); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(""); 
  const [isEditing, setIsEditing] = useState(false); 


  useEffect(() => {
    if (isAuthenticated && user) {
      setFullName(user.name || "User");
      setEmail(user.email || "");

      setProfileImage(user.picture || "https://via.placeholder.com/150");

  
      const savedPhone = localStorage.getItem(`phone_${user.email}`);
      const savedLocation = localStorage.getItem(`location_${user.email}`);

      if (savedPhone) setPhone(savedPhone);
      if (savedLocation) setLocation(savedLocation);
    }
  }, [isAuthenticated, user]);


  const handleSave = () => {
    if (isAuthenticated) {
      localStorage.setItem(`phone_${user.email}`, phone);
      localStorage.setItem(`location_${user.email}`, location);
      setIsEditing(false);
    }
  };

  return (
    <>
      <Navbar />
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

      <div className="profile-container">
        {/* Sidebar */}
        <div className="sidebar">
          <img src={profileImage} alt="Profile" className="profile-pic" />
          <h2>{fullName}</h2>
          <p className="membership">Premium Member</p>
          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          <ul className="sidebar-menu">
            <li><FaUser /> Personal Details</li>
            <li><FaCalendarAlt onClick={()=>navigate(`/booking`)} /> My Bookings</li>
            <li><FaHeart onClick={()=>navigate(`/savedVenues`)}/> Saved Venues</li>
            <li><FaRegCalendarCheck /> Upcoming Events</li>
            <li><FaCog /> Settings</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="section personal-details">
            <h3>Personal Details</h3>
            <div className="details-grid">
              <input type="text" placeholder="Full Name" value={fullName} disabled />
              <input type="email" placeholder="Email" value={email} disabled />
              <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} />
              <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} disabled={!isEditing} />
            </div>
            {isEditing && <button className="save-btn" onClick={handleSave}>Save Changes</button>}
          </div>

          {/* Upcoming Events */}
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

          {/* Saved Venues */}
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
