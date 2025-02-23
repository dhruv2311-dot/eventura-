import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './footer';

const CategoryDetails = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    axios.get(`https://eventura-2.onrender.com/categories/${id}`)
      .then(response => setCategory(response.data))
      .catch(error => console.error('Error fetching category details:', error));
  }, [id]);

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="category-details-container">
        <h1>{category.name}</h1>
        <img src={category.image_url} alt={category.name} className="category-image" />
        <p>{category.description}</p>
      </div>
      <Footer />
    </>
  );
};

export default CategoryDetails;
