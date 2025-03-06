// backend/server.js
const express = require("express");
const stripe = require("stripe")("sk_test_51QzdXNC6VkCbZF3lRvYOPfCr6WeOQDDojtOkRPNoQ4Q4eYDBTALVf51lmfCJK8k8xJYdLnisK8Cjukstv61Orvzo00KMc2nhXu"); // Replace with your Secret Key
const app = express();

app.use(express.json());

// Endpoint to create Stripe Checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { userId, bookingId, price, title, count } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: price * 100, // Amount in cents
          },
          quantity: count || 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/bookings?success=true&bookingId=${bookingId}&userId=${encodeURIComponent(userId)}`,
      cancel_url: `http://localhost:5173/bookings?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

// Endpoint to confirm booking after payment
app.post("/confirm-booking", async (req, res) => {
  const { userId, bookingId } = req.body;

  try {
    // Assuming you have a Booking model (e.g., MongoDB)
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, userId },
      { status: "Confirmed" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking confirmed", booking });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({ error: "Failed to confirm booking" });
  }
});



app.listen(3000, () => console.log("Server running on port 3000"));