import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./feedback.css";
import Footer from "./footer";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
    file: null,
  });
  const [recentFeedback, setRecentFeedback] = useState([
    {
      name: "Sarah Johnson",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      review: "Exceptional service! The team went above and beyond my expectations.",
      stars: 5,
    },
    {
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      review: "Great experience overall. Would definitely recommend to others.",
      stars: 4,
    },
    {
      name: "Emily Davis",
      image: "https://randomuser.me/api/portraits/women/52.jpg",
      review: "Impressive attention to detail and customer service.",
      stars: 4,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png"].includes(file.type)) {
      setFeedback({ ...feedback, file: file });
      setFilePreview(URL.createObjectURL(file));
    } else {
      setError("Please upload a valid image file (JPG, PNG) not exceeding 5MB.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", feedback.name);
    formData.append("email", feedback.email);
    formData.append("message", feedback.message);
    formData.append("rating", rating);
    if (feedback.file) {
      formData.append("image", feedback.file);
    }

    try {
      const response = await axios.post("http://localhost:5000/feedback", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Feedback submitted successfully!");
      setFeedback({ name: "", email: "", message: "", file: null });
      setRating(0);
      setFilePreview(null);
      fileInputRef.current.value = null;
    } catch (error) {
      setError("Error submitting feedback. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="feedback-page">
        <div className="hero">
          <div className="hero-content">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              We Value Your Feedback!
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              Help us improve by sharing your thoughts and experiences.
            </motion.p>
          </div>
        </div>

        <motion.form
          className="feedback-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="input-group">
            <input type="text" name="name" placeholder="Name (Optional)" className="input-field" onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" className="input-field" onChange={handleInputChange} required />
          </div>

          <div className="rating">
            <span>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.span key={star} className={`star ${star <= rating ? "filled" : ""}`} onClick={() => setRating(star)} whileHover={{ scale: 1.2 }}>
                ★
              </motion.span>
            ))}
          </div>

          <textarea name="message" placeholder="Your Message" className="textarea" onChange={handleInputChange} required></textarea>

          <label className="file-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} hidden />
            <span>Drop files here or click to upload</span>
          </label>
          {filePreview && <img src={filePreview} alt="Preview" className="file-preview" />}

          <motion.button type="submit" className="submit-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </motion.button>
          {error && <p className="error-message">{error}</p>}
        </motion.form>
        <div className="recent-feedback">
        <h2>Recent Feedback</h2>
        <motion.div
          className="feedback-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {recentFeedback.map((item, index) => (
            <motion.div
              className="feedback-item"
              key={index}
              whileHover={{ scale: 1.05 }}
            >
              <img src={item.image} alt={item.name} className="feedback-image" />
              <div>
                <h3>{item.name}</h3>
                <p>{item.review}</p>
                <div className="stars">
                  {"★".repeat(item.stars)}
                  {"☆".repeat(5 - item.stars)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default Feedback;
