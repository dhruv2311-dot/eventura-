import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './BookingPage.css';
import Navbar from './navbar';
import Footer from './footer';
const BookingPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchBookings(user.sub);
    }
  }, [isAuthenticated, user]);

  const fetchBookings = async (userId) => {
    try {
      console.log("Fetching bookings for user ID:", userId);
      const response = await fetch(`http://localhost:5000/bookings/${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          setBookings([]);
          setError("");
          return;
        }
        throw new Error(`Server responded with ${response.status}: ${errorText || "Failed to fetch bookings"}`);
      }

      const data = await response.json();
      console.log("Bookings data:", data);

      if (!data.bookings || !Array.isArray(data.bookings)) {
        throw new Error("No valid bookings found in response");
      }

      setBookings(data.bookings);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("❌ Fetching bookings error:", err);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/bookings/${encodeURIComponent(user.sub)}/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update status: ${errorText}`);
      }

      // Refresh bookings after update
      fetchBookings(user.sub);
    } catch (err) {
      setError(err.message);
      console.error("❌ Status update error:", err);
    }
  };

  // Calculate total money
  const totalMoney = bookings.reduce((sum, booking) => sum + (booking.price * (booking.count || 1)), 0);

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <p>Please log in to view your bookings.</p>;

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <h2>My Bookings</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {bookings.length > 0 ? (
          <>
            <ul className="booking-list">
              {bookings.map((booking) => (
                <li key={booking._id} className="booking-card">
                  <img
                    src={booking.image || "https://via.placeholder.com/100"}
                    alt={booking.title}
                    className="booking-image"
                  />
                  <div className="booking-details">
                    <h3>{booking.title}</h3>
                    <p><strong>Description:</strong> {booking.description || "No description"}</p>
                    <p><strong>Count:</strong> {booking.count || 1}</p>
                    <p><strong>Price per item:</strong> ${booking.price}</p>
                    <p><strong>Total Price:</strong> ${(booking.price * (booking.count || 1)).toFixed(2)}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    {booking.status === "Pending" && (
                      <div className="booking-actions">
                        <button
                          onClick={() => handleStatusUpdate(booking._id, "Confirmed")}
                          className="confirm-btn"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
                          className="cancel-btn"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="booking-summary">
              <h3>Summary</h3>
              <p><strong>Total Items:</strong> {bookings.length}</p>
              <p><strong>Total Money:</strong> ${totalMoney.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;