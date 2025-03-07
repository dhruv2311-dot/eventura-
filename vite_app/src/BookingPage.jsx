import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import './BookingPage.css';
import Navbar from './navbar';
import Footer from './footer';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QzdXNC6VkCbZF3l6wJmU7BRarVcsFgACpI9RQThRcc0dH4q4eFl8iMYt2zrBzmhm6CTyEt6NAdUDYZm8NhyPR5m008Zxr7RDP');

const CheckoutForm = ({ bookingId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      const response = await fetch(`http://localhost:3000/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess(bookingId);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="payment-actions">
        <button type="submit" disabled={!stripe || processing} className="pay-btn">
          {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

const BookingPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(null); // Track which booking to show payment for
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchBookings(user.sub);
    }
  }, [isAuthenticated, user]);

  const fetchBookings = async (userId) => {
    try {
      const response = await fetch(`https://eventura-10.onrender.com/bookings/${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setBookings([]);
          setError("");
          return;
        }
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`https://eventura-10.onrender.com/bookings/${encodeURIComponent(user.sub)}/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      fetchBookings(user.sub);
      setShowPayment(null); // Close payment form after success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmWithPayment = (booking) => {
    setShowPayment(booking._id); // Show payment form for this booking
  };

  const onPaymentSuccess = (bookingId) => {
    handleStatusUpdate(bookingId, "Confirmed"); // Update status after payment
    navigate('/success'); // Navigate to success page
  };

  const onPaymentCancel = () => {
    setShowPayment(null); // Close payment form
    navigate('/cancel'); // Navigate to cancel page
  };

  const activeBookings = bookings.filter(booking => booking.status !== "Cancelled");
  const totalMoney = activeBookings.reduce((sum, booking) => sum + (booking.price * (booking.count || 1)), 0);
  const totalItems = activeBookings.length;

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
                        {showPayment !== booking._id ? (
                          <button
                            onClick={() => handleConfirmWithPayment(booking)}
                            className="confirm-btn"
                          >
                            Confirm & Pay
                          </button>
                        ) : (
                          <Elements stripe={stripePromise}>
                            <CheckoutForm
                              bookingId={booking._id}
                              amount={booking.price * (booking.count || 1)}
                              onSuccess={onPaymentSuccess}
                              onCancel={onPaymentCancel}
                            />
                          </Elements>
                        )}
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
              <p><strong>Total Active Items:</strong> {totalItems}</p>
              <p><strong>Total Active Money:</strong> ${totalMoney.toFixed(2)}</p>
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