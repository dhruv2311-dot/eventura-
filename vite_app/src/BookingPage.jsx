import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./BookingPage.css";

const BookingPage = () => {
  const navigate = useNavigate();
  const [bookingItems, setBookingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Get all bookings from localStorage
    const fetchBookingDetails = () => {
      try {
        const existingBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
        if (existingBookings.length === 0) {
          setError("No bookings found!");
          setLoading(false);
          return;
        }
        
        // Get all pending bookings
        const pendingBookings = existingBookings.filter(booking => booking.status === "Pending");
        setBookingItems(pendingBookings);
        
        // Calculate total price
        const total = pendingBookings.reduce((sum, item) => {
          const price = item.price === "N/A" ? 0 : parseFloat(item.price);
          return sum + price;
        }, 0);
        
        setTotalPrice(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Failed to load booking details");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleConfirmAllBookings = async () => {
    try {
      if (bookingItems.length === 0) {
        toast.error("No bookings to confirm");
        return;
      }

      // Update each booking status in the database
      const updatePromises = bookingItems.map(item => 
        fetch(`https://eventura-10.onrender.com/bookings/confirm/${item.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        })
      );
      
      const results = await Promise.allSettled(updatePromises);
      const allSuccessful = results.every(result => result.status === "fulfilled" && result.value.ok);
      
      if (allSuccessful) {
        // Update the bookings in localStorage
        const existingBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
        const updatedBookings = existingBookings.map(booking => 
          bookingItems.some(item => item.itemId === booking.itemId)
            ? { ...booking, status: "Confirmed" } 
            : booking
        );
        
        localStorage.setItem("myBookings", JSON.stringify(updatedBookings));
        
        toast.success("All bookings confirmed successfully!");
        
        // Update state to show confirmed status
        setBookingItems(bookingItems.map(item => ({ ...item, status: "Confirmed" })));
      } else {
        toast.error("Failed to confirm some bookings");
      }
    } catch (error) {
      console.error("Error confirming bookings:", error);
      toast.error("Error confirming bookings");
    }
  };
  
  const handleRemoveItem = async (itemId) => {
    try {
      console.log(`Attempting to delete booking with itemId: ${itemId}`);
      
      const response = await fetch(`http://localhost:5000/bookings/${itemId}`, {
        method: "DELETE",
      });

      console.log(`Response status: ${response.status}`);
      
      if (response.ok) {
        console.log("Booking deleted successfully from MongoDB.");
        
        // Remove from state
        const updatedItems = bookingItems.filter(item => item.itemId !== itemId);
        setBookingItems(updatedItems);

        // Remove from localStorage
        const existingBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
        const updatedBookings = existingBookings.filter(booking => booking.itemId !== itemId);
        localStorage.setItem("myBookings", JSON.stringify(updatedBookings));

        // Recalculate total price
        const total = updatedItems.reduce((sum, item) => {
          const price = item.price === "N/A" ? 0 : parseFloat(item.price);
          return sum + price;
        }, 0);
        setTotalPrice(total);

        toast.success("Booking canceled successfully!");
      } else {
        console.error("Failed to cancel booking in MongoDB.");
        toast.error("Failed to cancel booking in MongoDB.");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("Error canceling booking.");
    }
  };

  const handleCancelBooking = async () => {
    try {
      const cancelPromises = bookingItems.map(item => handleRemoveItem(item.itemId));
      await Promise.all(cancelPromises);
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error canceling all bookings:", error);
      toast.error("Error canceling all bookings.");
    }
  };

  if (loading) return <div className="booking-loading">Loading booking details...</div>;
  if (error) return <div className="booking-error">{error}</div>;
  if (bookingItems.length === 0) return <div className="booking-empty">Your booking cart is empty</div>;

  return (
    <div className="booking-page-container">
      <div className="booking-card">
        <div className="booking-header">
          <h1>Booking Confirmation</h1>
          <div className="booking-summary">
            <span className="booking-count">{bookingItems.length} items</span>
            <span className="booking-total">Total: ${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="booking-items-container">
          {bookingItems.map((item, index) => (
            <div className="booking-item" key={index}>
              <div className="booking-item-image-container">
                <img 
                  src={item.image || "https://via.placeholder.com/150x100?text=No+Image"} 
                  alt={item.name} 
                  className="booking-item-image" 
                />
                <span className="booking-item-type">{item.type}</span>
              </div>
              
              <div className="booking-item-details">
                <h3>{item.name}</h3>
                <p className="booking-item-description">
                  {item.description ? `${item.description.substring(0, 100)}...` : "No description available"}
                </p>
                
                <div className="booking-item-info">
                  {item.price && item.price !== "N/A" && (
                    <span className="price-badge">${item.price}/day</span>
                  )}
                  
                  {item.venueName && (
                    <span className="venue-badge">Venue: {item.venueName}</span>
                  )}
                  
                  {item.eventName && (
                    <span className="event-badge">Event: {item.eventName}</span>
                  )}
                </div>
              </div>
              
              <div className="booking-item-actions">
                <button 
                  className="remove-item-btn" 
                  onClick={() => handleRemoveItem(item.itemId)}
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="booking-options">
          <h3>Additional Services</h3>
          <div className="options-grid">
            <div className="option-item">
              <input type="checkbox" id="catering" />
              <label htmlFor="catering">Catering Services</label>
            </div>
            <div className="option-item">
              <input type="checkbox" id="decoration" />
              <label htmlFor="decoration">Decoration Setup</label>
            </div>
            <div className="option-item">
              <input type="checkbox" id="photography" />
              <label htmlFor="photography">Photography Package</label>
            </div>
            <div className="option-item">
              <input type="checkbox" id="transport" />
              <label htmlFor="transport">Transportation</label>
            </div>
          </div>
        </div>
        
        <div className="booking-actions">
          <button 
            className="booking-action-btn cancel-btn" 
            onClick={handleCancelBooking}
          >
            Back to Shopping
          </button>
          
          <button 
            className="booking-action-btn confirm-btn" 
            onClick={handleConfirmAllBookings}
          >
            Confirm All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;