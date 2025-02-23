import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from './DataFetcher';
import './VenueDetails.css'; // Import CSS
import Navbar from './Navbar';
import Footer from './footer';
const VenueDetails = () => {
  const { id } = useParams();
  const { venues } = useData();

  const venue = venues.find((v) => v._id === id);

  if (!venue) {
    return <h2>Venue not found</h2>;
  }

  return (
    <>
      <Navbar />
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      <div className="details-container">
        <h2>{venue.name}</h2>
        <p><strong>Location:</strong> {venue.location}</p>
        <p><strong>Capacity:</strong> {venue.capacity}</p>
        <p><strong>Price/Day:</strong> ${venue.price_per_day}</p>

        {/* Image Gallery */}
        <div className="image-gallery">
          {venue.images.map((img, index) => (
            <img key={index} src={img} alt={`Venue ${index}`} />
          ))}
        </div>

        {/* Details Content */}
        <div className="details-content">
          <p>{venue.description}</p>
          <div className="details-section">
            <h3>Key Highlights</h3>
            <ul>
              {venue.key_highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div className="details-section">
            <h3>Services</h3>
            <ul>
              {venue.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
          <p className="additional-info"><strong>Additional Info:</strong> {venue.additional_info}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VenueDetails;
