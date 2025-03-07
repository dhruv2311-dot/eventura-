import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from './navbar';
import Footer from './footer';
import './BookingPage.css'; // Reuse the same CSS

const stripePromise = loadStripe('pk_test_51QzdXNC6VkCbZF3l6wJmU7BRarVcsFgACpI9RQThRcc0dH4q4eFl8iMYt2zrBzmhm6CTyEt6NAdUDYZm8NhyPR5m008Zxr7RDP');

const CheckoutForm = ({ bookingId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

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
        // Update booking status
        await fetch(`https://eventura-10.onrender.com/bookings/${encodeURIComponent(localStorage.getItem('userId'))}/${bookingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Confirmed" }),
        });
        navigate('/success');
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate('/cancel');
  };

  return (
    <div className="payment-page">
      <h2>Complete Your Payment</h2>
      <p>Amount: ${amount.toFixed(2)}</p>
      <form onSubmit={handleSubmit} className="payment-form">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={!stripe || processing} className="pay-btn">
          {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </button>
        <button type="button" onClick={handleCancel} className="cancel-btn">
          Cancel Payment
        </button>
      </form>
    </div>
  );
};

const PaymentPage = () => {
  const { state } = useLocation();
  const { bookingId, amount } = state || {};

  if (!bookingId || !amount) return <p>Invalid payment request.</p>;

  return (
    <>
      <Navbar />
      <Elements stripe={stripePromise}>
        <CheckoutForm bookingId={bookingId} amount={amount} />
      </Elements>
      <Footer />
    </>
  );
};

export default PaymentPage;