const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_51QzdXNC6VkCbZF3lRvYOPfCr6WeOQDDojtOkRPNoQ4Q4eYDBTALVf51lmfCJK8k8xJYdLnisK8Cjukstv61Orvzo00KMc2nhXu'); // Replace with your Stripe secret key

app.use(cors());
app.use(express.json());

// Existing booking endpoints (assuming you have these)
app.get("/bookings/:userId", async (req, res) => {
  try {
      const userId = decodeURIComponent(req.params.userId);
      console.log("✅ Backend Received User ID:", userId);

      const bookings = await bookingsCollection.find({ userId }).toArray();

      res.status(200).json({
          bookings: bookings || [],
          totalItems: bookings.length || 0,
          totalPrice: bookings.reduce((sum, b) => sum + (b.price * (b.count || 1)), 0) || 0,
      });
  } catch (error) {
      console.error("❌ Backend Error:", error);
      res.status(500).json({ message: "Server error", error });
  }
});

app.put('/bookings/:userId/:bookingId', async (req, res) => {
  try {
      const { userId, bookingId } = req.params;
      const { status } = req.body;

      if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status value' });
      }

      if (!ObjectId.isValid(bookingId)) {
          return res.status(400).json({ message: 'Invalid booking ID' });
      }

      const result = await bookingsCollection.updateOne(
          { userId, _id: new ObjectId(bookingId) },
          { $set: { status } }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({ message: `Booking ${status.toLowerCase()} successfully` });
  } catch (error) {
      console.error('🔴 Error updating booking status:', error);
      res.status(500).json({ message: 'Server error', error });
  }
});

// New endpoint for Stripe payment intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd', // Change currency as needed
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));