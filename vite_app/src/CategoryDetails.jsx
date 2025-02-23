import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from './DataFetcher';
import './CategoryDetails.css'; // Import CSS
import Navbar from "./Navbar";
import Footer from './footer';
const CategoryDetails = () => {
    const { id } = useParams();
    const { categories } = useData();
    
    const category = categories.find((cat) => cat._id === id);

    if (!category) {
        return <h2>Category not found</h2>;
    }

    return (
      <>
        <Navbar />
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <div className="details-container">
            <h2>{category.name}</h2>

            {/* Image Gallery */}
            <div className="image-gallery">
                {category.featured_images.map((img, index) => (
                    <img key={index} src={img} alt={`Category ${index}`} />
                ))}
            </div>

            {/* Details Content */}
            <div className="details-content">
                <p>{category.description}</p>
                <div className="details-section">
                    <h3>Key Highlights</h3>
                    <ul>
                        {category.key_highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                        ))}
                    </ul>
                </div>
                <div className="details-section">
                    <h3>Services</h3>
                    <ul>
                        {category.services.map((service, index) => (
                            <li key={index}>{service}</li>
                        ))}
                    </ul>
                </div>
                <p className="additional-info"><strong>Additional Info:</strong> {category.additional_info}</p>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default CategoryDetails;
