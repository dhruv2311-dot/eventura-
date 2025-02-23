import React from "react";
import { Link } from "react-router-dom";
import { useData } from "./DataFetcher"; // Importing data
import Navbar from "./Navbar";
import Footer from "./footer";
import "./homepage.css";

const Homepage = () => {
  const { categories, venues, team, reviews } = useData();

  return (
    <>
      <Navbar />
      <section className="hero-section">
        <div className="overlay">
          <h2 className="hero-title">Your Event, Our Expertise</h2>
          <div className="search-filters">
            <input type="text" placeholder="Search Category" className="search-input" />
            <input type="text" placeholder="Search Location" className="search-input" />
            <button className="search-button">Search</button>
          </div>
        </div>
      </section>
      <div className="eventura-container">
        <h2 className="category">Browse By Category</h2>
        <div className="categories-container">
          {categories.map((category) => (
            <Link key={category._id} to={`/category/${category._id}`} className="category-card">
              <img src={category.image_url} alt={category.name} />
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>

        <h2 className="venues">Popular Venues</h2>
        <div className="venues-container">
          {venues.map((venue) => (
            <Link key={venue._id} to={`/venue/${venue._id}`} className="venue-card">
              <img src={venue.images[0]} alt={venue.name} className="venue-image" />
              <div className="venue-details">
                <h3>{venue.name}</h3>
                <p><strong>Location:</strong> {venue.location}</p>
                <p><strong>Price/Day:</strong> ${venue.price_per_day}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="start-event-wrapper">
        <div className="start-event-container">
          <img
            src="https://st2.depositphotos.com/3732989/5330/i/380/depositphotos_53302063-stock-photo-lets-start-text.jpg"
            alt="Let's Start"
            className="start-event-image"
          />
          <div className="start-event-content">
            <h2>Let’s Begin Crafting Your Event!</h2>
            <p>Let's kickstart your event journey today, turning your dreams into remarkable moments.</p>
          </div>
        </div>
      </div>
      <h2 className='team'>MEET OUR TEAM AND ORGANIZERS</h2>
        <div className="team-wrapper">
        {team.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.profile_image} alt={member.name} className="team-image" />
            <div className="team-info">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p>{member.experience} of experience</p>
              <p>Email: {member.email}</p>
              <p>Phone: {member.phone}</p>
            </div>
          </div>
        ))}
      </div>

        <h2 className="reviews">Reviews</h2>
        <div className="review-container">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-avatar">{review.name.charAt(0)}</div>
            <div className="review-content">
              <h3>{review.name}</h3>
              <p>{review.comment}</p>
              <span>Rating: {review.rating} ⭐</span>
              <small>{review.event_type} - {new Date(review.review_date).toDateString()}</small>
            </div>
          </div>
        ))}
      </div>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
