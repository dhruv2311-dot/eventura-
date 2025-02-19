import React, { useState } from "react";
import { motion } from "framer-motion";
import "./feedback.css";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleFileChange = (e) => {
    setFeedback({ ...feedback, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", feedback);
  };

  return (
    <div className="feedback-page">
      {/* Hero Section */}
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

      {/* Feedback Form */}
      <motion.form
        className="feedback-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Name (Optional)"
            className="input-field"
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Star Rating */}
        <div className="rating">
          <span>Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              className={`star ${star <= rating ? "filled" : ""}`}
              onClick={() => setRating(star)}
              whileHover={{ scale: 1.2 }}
            >
              ★
            </motion.span>
          ))}
        </div>

        {/* Message Box */}
        <textarea
          name="message"
          placeholder="Your Message"
          className="textarea"
          onChange={handleInputChange}
          required
        ></textarea>

        {/* File Upload */}
        <label className="file-upload">
          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          <span>Drop files here or click to upload</span>
        </label>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="submit-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit Feedback
        </motion.button>
      </motion.form>

      {/* Recent Feedback Section */}
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
  );
};

export default Feedback;


// import { useState } from "react";
// import { motion } from "framer-motion";
// import "./feedback.css";

// const Feedback = () => {
//   const [rating, setRating] = useState(0);
//   const [hover, setHover] = useState(0);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//     image: null,
//   });

//   const [feedbackList, setFeedbackList] = useState([
//     {
//       name: "John Doe",
//       message: "Amazing event management! Everything was perfect.",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdrkNdumT-XgDOUdMgaleHw1Zr1F2cB0satw&s",
//       rating: 5,
//     },
//     {
//       name: "Sarah Lee",
//       message: "Loved the experience, highly recommended!",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqYMpNuytiasz3HMaGAGYGlcJF11V9LyDmpg&s",
//       rating: 4,
//     },
//     {
//       name: "Michael Smith",
//       message: "Great work, but a few things can be improved.",
//       image: "https://m.media-amazon.com/images/M/MV5BZTFlYjk2MTMtZjE1Zi00YzZhLWFmNTctOTUxZTYyZWMyMDQ0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
//       rating: 3,
//     },
//   ]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, image: e.target.files[0] });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newFeedback = {
//       name: formData.name || "Anonymous",
//       message: formData.message,
//       image: formData.image ? URL.createObjectURL(formData.image) : "https://source.unsplash.com/100x100/?user",
//       rating,
//     };
//     setFeedbackList([newFeedback, ...feedbackList]);
//     alert("Feedback submitted! Thank you.");
//   };

//   return (
//     <div className="feedback-page">
//       {/* Hero Section */}
//       <motion.div 
//         className="hero" 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       ></motion.div>

//       {/* Feedback Form */}
//       <motion.div 
//         className="feedback-form"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <form onSubmit={handleSubmit} className="form-container">
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name (Optional)"
//             className="input-field"
//             onChange={handleChange}
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             className="input-field"
//             onChange={handleChange}
//             required
//           />
//           <textarea
//             name="message"
//             placeholder="Your Feedback"
//             className="textarea"
//             onChange={handleChange}
//             required
//           ></textarea>

//           {/* File Upload */}
//           <input type="file" accept="image/*" className="file-input" onChange={handleFileChange} />

//           {/* Star Rating */}
//           <div className="rating">
//             <p>Rate Us:</p>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <motion.span
//                 key={star}
//                 className={`star ${star <= (hover || rating) ? "filled" : ""}`}
//                 onClick={() => setRating(star)}
//                 onMouseEnter={() => setHover(star)}
//                 onMouseLeave={() => setHover(rating)}
//                 whileHover={{ scale: 1.2 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 ★
//               </motion.span>
//             ))}
//           </div>

//           <button type="submit" className="submit-btn">
//             Submit Feedback
//           </button>
//         </form>
//       </motion.div>

//       {/* Recent Feedback Section */}
//       <motion.div 
//         className="recent-feedback"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
//       >
//         <h2>Recent Feedback</h2>
//         <div className="feedback-list">
//           {feedbackList.map((feedback, index) => (
//             <motion.div
//               key={index}
//               className="feedback-item"
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//             >
//               <img src={feedback.image} alt="User" className="feedback-image" />
//               <div>
//                 <h3>{feedback.name}</h3>
//                 <p>{feedback.message}</p>
//                 <div className="stars">
//                   {"★".repeat(feedback.rating)}
//                   {"☆".repeat(5 - feedback.rating)}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Feedback;
