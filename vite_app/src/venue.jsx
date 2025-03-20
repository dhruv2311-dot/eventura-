
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth0 } from "@auth0/auth0-react";
// import axios from 'axios';
// import Navbar from './navbar';
// import Footer from './footer';
// import './venues.css';
// import loaderGif from './assets/loader.gif';
// import { toast } from "react-toastify";

// const Venue = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
//   const [searchCategory, setSearchCategory] = useState("");
//   const [searchLocation, setSearchLocation] = useState("");
//   const [filteredVenues, setFilteredVenues] = useState([]);
//   const [allVenues, setAllVenues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [savedVenues, setSavedVenues] = useState([]);
//   const [showVenueDropdown, setShowVenueDropdown] = useState(false);
//   const [selectedVenueLocation, setSelectedVenueLocation] = useState(null);

//   const venueLocations = [...new Set(allVenues.map((venue) => venue.location))];

//   useEffect(() => {
//     axios
//       .get("https://eventura-2.onrender.com/venues")
//       .then((response) => {
//         setAllVenues(response.data);
//         setFilteredVenues(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching venues:", error);
//         setError(error);
//         setLoading(false);
//       });

//     if (isAuthenticated && user?.sub) {
//       fetchSavedVenues();
//     }
//   }, [isAuthenticated, user]);

//   const fetchSavedVenues = async () => {
//     try {
//       const response = await axios.get(`https://eventura-11.onrender.com/users/${user.sub}/saved-venues`);
//       setSavedVenues(response.data.savedVenues || []);
//     } catch (error) {
//       console.error("Error fetching saved venues:", error.response?.data || error.message);
//       toast.error("Failed to load saved venues.");
//     }
//   };

//   const handleSaveVenue = async (venueId) => {
//     if (!isAuthenticated || !user?.sub) {
//       toast.error("Please log in to save venues.");
//       navigate("/login");
//       return;
//     }

//     const isSaved = savedVenues.includes(venueId);
//     try {
//       const response = await axios.post(`https://eventura-11.onrender.com/users/${user.sub}/saved-venues`, {
//         venueId,
//         action: isSaved ? "remove" : "add",
//       });

//       if (response.status === 200) {
//         if (isSaved) {
//           setSavedVenues(savedVenues.filter((id) => id !== venueId));
//           toast.success("Venue removed from saved list!");
//         } else {
//           setSavedVenues([...savedVenues, venueId]);
//           toast.success("Venue saved successfully!");
//         }
//       }
//     } catch (error) {
//       console.error("Error saving venue:", error.response?.data || error.message);
//       toast.error("Failed to save venue: " + (error.response?.data?.message || "Unknown error"));
//     }
//   };

//   const handleBookNow = async (itemId) => {
//     try {
//       if (!isAuthenticated || !user?.sub) {
//         toast.error("Please log in to book.");
//         navigate("/login");
//         return;
//       }

//       const apiUrl = `https://eventura-2.onrender.com/venues/${itemId}`;
//       const response = await fetch(apiUrl);
//       const item = await response.json();

//       if (!response.ok || !item) {
//         toast.error("Failed to fetch venue details.");
//         return;
//       }

//       const bookingData = {
//         userId: user.sub,
//         title: item.name,
//         image: item.images?.[0] || "https://via.placeholder.com/100",
//         description: item.description || "No description available",
//         price: item.price_per_day || 50,
//         type: "venue",
//         venueId: item._id,
//         count: 1,
//         status: "Pending",
//       };

//       const saveResponse = await fetch("https://eventura-10.onrender.com/bookings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bookingData),
//       });

//       if (saveResponse.ok) {
//         toast.success("Booking request sent successfully!");
//         navigate("/booking");
//       } else {
//         const errorData = await saveResponse.json();
//         toast.error(`Failed to send booking request: ${errorData.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Booking error:", error);
//       toast.error("Error while booking.");
//     }
//   };

//   const applyFilters = () => {
//     let filtered = allVenues;

//     // Apply search filters
//     filtered = filtered.filter((venue) =>
//       venue.name.toLowerCase().includes(searchCategory.toLowerCase()) &&
//       venue.location.toLowerCase().includes(searchLocation.toLowerCase())
//     );

//     // Apply location dropdown filter if selected
//     if (selectedVenueLocation) {
//       filtered = filtered.filter((venue) => venue.location === selectedVenueLocation);
//     }

//     setFilteredVenues(filtered);
//   };

//   const handleLiveSearch = (type, value) => {
//     if (type === "category") {
//       setSearchCategory(value);
//     } else if (type === "location") {
//       setSearchLocation(value);
//     }
//     applyFilters();
//   };

//   const handleVenueFilterSelect = (location) => {
//     if (selectedVenueLocation === location) {
//       setSelectedVenueLocation(null);
//     } else {
//       setSelectedVenueLocation(location);
//     }
//     setShowVenueDropdown(false);
//     applyFilters();
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [selectedVenueLocation, allVenues]);

//   if (authLoading || loading) {
//     return (
//       <div className="loader-container">
//         <img src={loaderGif} alt="Loading..." className="loader" />
//       </div>
//     );
//   }

//   if (error) {
//     return <h2 className="error">Error loading venues.</h2>;
//   }

//   return (
//     <>
//       <Navbar />
//       <section
//         className="hero-section-2"
//         style={{
//           backgroundImage:
//             "url('https://i0.wp.com/suessmoments.com/wp-content/uploads/sites/10014/2023/02/website-shadowbrook-nj-wedding-photos-7153-photography-by-SUESS-MOMENTS.jpg?ssl=1')",
//         }}
//       >
//         <div className="overlay2">
//           <h2 className="hero-title2">OUR VENUES</h2>
//           <div className="search-filters2">
//             <input
//               type="text"
//               placeholder="Search Venue Name"
//               className="search-input"
//               value={searchCategory}
//               onChange={(e) => handleLiveSearch("category", e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Search Location"
//               className="search-input"
//               value={searchLocation}
//               onChange={(e) => handleLiveSearch("location", e.target.value)}
//             />
//           </div>
//         </div>
//       </section>

//       <div className="filter-container">
//         <button
//           className="filter-button text-black"
//           onClick={() => setShowVenueDropdown(!showVenueDropdown)}
//         >
//           Filter by Location
//         </button>
//         {showVenueDropdown && (
//           <div className="filter-dropdown">
//             <div
//               className={`filter-option ${!selectedVenueLocation ? "selected" : ""}`}
//               onClick={() => handleVenueFilterSelect(null)}
//             >
//               All Locations
//             </div>
//             {venueLocations.map((location) => (
//               <div
//                 key={location}
//                 className={`filter-option ${
//                   selectedVenueLocation === location ? "selected" : ""
//                 }`}
//                 onClick={() => handleVenueFilterSelect(location)}
//               >
//                 {location}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="venues-container">
//         <h2>📍 All Venues</h2>
//         <div className="venues-grid">
//           {filteredVenues.length > 0 ? (
//             filteredVenues.map((venue) => (
//               <div
//                 key={venue._id}
//                 className="venue-card"
//                 onClick={() => navigate(`/venue/${venue._id}`)}
//               >
//                 <img src={venue.images?.[0]} alt={venue.name} className="venue-image" />
//                 <h3 className="venue-name">{venue.name}</h3>
//                 <p className="venue-location">📍 {venue.location}</p>
//                 <p className="venue-price">💰 ${venue.price_per_day} per day</p>
//                 <button
//                   className="book-now-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleBookNow(venue._id);
//                   }}
//                 >
//                   Book Now
//                 </button>
//                 <span
//                   className={`heart-icon ${savedVenues.includes(venue._id) ? "saved" : ""}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleSaveVenue(venue._id);
//                   }}
//                 >
//                   {savedVenues.includes(venue._id) ? "❤️" : "🤍"}
//                 </span>
//               </div>
//             ))
//           ) : (
//             <p className="no-results">No venues found.</p>
//           )}
//         </div>
//       </div>
//       <div className="container">
//         <img
//           src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTot0czju3Rw2f9QpIuhuZcKG2OHcDb5s6TYwtZ9QVRZqCOIJUn"
//           alt="Venue Image"
//           className="image"
//         />
//         <div className="text-container">
//           <h1 className="title">Perfect Venue, Memorable Events.</h1>
//           <p className="description">
//             Secure your event's stage, book the perfect venue today. Elevate your occasions with ease.
//           </p>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Venue;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Navbar from './navbar';
import Footer from './footer';
import './venues.css';
import loaderGif from './assets/loader.gif';
import { toast } from "react-toastify";

const Venue = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [searchName, setSearchName] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedVenues, setSavedVenues] = useState([]);
  
  // Advanced Filter States
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [selectedLocation, setSelectedLocation] = useState("");
  const [capacityRange, setCapacityRange] = useState({ min: 0, max: Infinity });
  const [venueType, setVenueType] = useState("");

  // Filter Options
  const venueLocations = [...new Set(allVenues.map(venue => venue.location))];
  const venueTypes = ["Banquet Hall", "Resort", "Outdoor", "Hotel"];

  useEffect(() => {
    axios
      .get("https://eventura-2.onrender.com/venues")
      .then((response) => {
        setAllVenues(response.data);
        setFilteredVenues(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching venues:", error);
        setError(error);
        setLoading(false);
      });

    if (isAuthenticated && user?.sub) {
      fetchSavedVenues();
    }
  }, [isAuthenticated, user]);

  const fetchSavedVenues = async () => {
    try {
      const response = await axios.get(`https://eventura-11.onrender.com/users/${user.sub}/saved-venues`);
      setSavedVenues(response.data.savedVenues || []);
    } catch (error) {
      console.error("Error fetching saved venues:", error.response?.data || error.message);
      toast.error("Failed to load saved venues.");
    }
  };

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
      toast.error("Failed to save venue: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleBookNow = async (itemId) => {
    try {
      if (!isAuthenticated || !user?.sub) {
        toast.error("Please log in to book.");
        navigate("/login");
        return;
      }

      const apiUrl = `https://eventura-2.onrender.com/venues/${itemId}`;
      const response = await fetch(apiUrl);
      const item = await response.json();

      if (!response.ok || !item) {
        toast.error("Failed to fetch venue details.");
        return;
      }

      const bookingData = {
        userId: user.sub,
        title: item.name,
        image: item.images?.[0] || "https://via.placeholder.com/100",
        description: item.description || "No description available",
        price: item.price_per_day || 50,
        type: "venue",
        venueId: item._id,
        count: 1,
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

  const applyFilters = () => {
    let filtered = allVenues;

    // Name Search
    if (searchName) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Price Range Filter
    filtered = filtered.filter(venue => 
      venue.price_per_day >= priceRange.min && 
      (priceRange.max === Infinity || venue.price_per_day <= priceRange.max)
    );

    // Location Filter
    if (selectedLocation) {
      filtered = filtered.filter(venue => venue.location === selectedLocation);
    }

    // Capacity Filter
    filtered = filtered.filter(venue => 
      venue.capacity >= capacityRange.min && 
      (capacityRange.max === Infinity || venue.capacity <= capacityRange.max)
    );

    // Venue Type Filter
    if (venueType) {
      filtered = filtered.filter(venue => venue.type === venueType);
    }

    setFilteredVenues(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchName, priceRange, selectedLocation, capacityRange, venueType, allVenues]);

  const resetFilters = () => {
    setSearchName("");
    setPriceRange({ min: 0, max: Infinity });
    setSelectedLocation("");
    setCapacityRange({ min: 0, max: Infinity });
    setVenueType("");
  };

  if (authLoading || loading) {
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
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="filter-section">
        <h3>Filter Venues</h3>
        <div className="filter-controls">
          {/* Price Range Filter */}
          <div className="filter-group">
            <label>Price Range (₹)</label>
            <select 
              value={priceRange.min === 0 && priceRange.max === Infinity ? "" : `${priceRange.min}-${priceRange.max}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setPriceRange({ min: min || 0, max: max || Infinity });
              }}
            >
              <option value="">All Prices</option>
              <option value="0-5000">Up to ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="10000-20000">₹10,000 - ₹20,000</option>
              <option value="20000-Infinity">₹20,000+</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label>Location</label>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {venueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Capacity Filter */}
          <div className="filter-group">
            <label>Capacity</label>
            <select 
              value={capacityRange.min === 0 && capacityRange.max === Infinity ? "" : `${capacityRange.min}-${capacityRange.max}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setCapacityRange({ min: min || 0, max: max || Infinity });
              }}
            >
              <option value="">All Capacities</option>
              <option value="0-50">Up to 50</option>
              <option value="50-100">50 - 100</option>
              <option value="100-500">100 - 500</option>
              <option value="500-Infinity">500+</option>
            </select>
          </div>

          {/* Venue Type Filter */}
          <div className="filter-group">
            <label>Venue Type</label>
            <select 
              value={venueType}
              onChange={(e) => setVenueType(e.target.value)}
            >
              <option value="">All Types</option>
              {venueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

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
                <p className="venue-price">💰 ₹{venue.price_per_day} per day</p>
                <p className="venue-capacity">👥 {venue.capacity} guests</p>
                <p className="venue-type">🏛️ {venue.type || "N/A"}</p>
                <button
                  className="book-now-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookNow(venue._id);
                  }}
                >
                  Book Now
                </button>
                <span
                  className={`heart-icon ${savedVenues.includes(venue._id) ? "saved" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
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