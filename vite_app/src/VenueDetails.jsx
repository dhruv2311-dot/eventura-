import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './footer';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    axios.get(`https://eventura-2.onrender.com/venues/${id}`)
      .then(response => setVenue(response.data))
      .catch(error => console.error('Error fetching venue details:', error));
  }, [id]);

  if (!venue) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="venue-details-container">
        <h1>{venue.name}</h1>
        <img src={venue.images[0]} alt={venue.name} className="venue-image" />
        <p><strong>Location:</strong> {venue.location}</p>
        <p><strong>Capacity:</strong> {venue.capacity}</p>
        <p><strong>Price/Day:</strong> ${venue.price_per_day}</p>
        <p>{venue.description}</p>
      </div>
      <Footer />
    </>
  );
};

export default VenueDetails;
