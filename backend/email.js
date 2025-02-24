const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 💌 Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App Password from Gmail
  },
});

// 💡 API to Send Welcome Email
app.post("/send-welcome-email", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and Name are required" });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Eventura!",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for signing up with Eventura. We’re excited to have you on board!</p>
        <p>Explore amazing events and venues.</p>
        <p>Best Regards, <br> The Eventura Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Welcome email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
