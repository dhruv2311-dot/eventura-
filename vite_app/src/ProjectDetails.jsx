import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './ProjectDetails.css';
import Navbar from './navbar';
import Footer from './footer';
const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios
      .get(`https://eventura-3.onrender.com/projects/${id}`) // Replace with actual API URL
      .then((response) => setProject(response.data))
      .catch((error) => console.error("Error fetching project details:", error));
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <>
    <Navbar/>
    <div className="project-details">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p><strong>Date:</strong> {project.date}</p>
      <p><strong>Venue:</strong> {project.venue}</p>
      <p><strong>Manager:</strong> {project.manager}</p>
      <p><strong>Budget:</strong> {project.budget}</p>
      
      <h3>Highlights</h3>
      <ul>
        {project.highlights.map((highlight, index) => (
          <li key={index}>{highlight}</li>
        ))}
      </ul>

      <h3>Services</h3>
      <ul>
        {project.services.map((service, index) => (
          <li key={index}>{service}</li>
        ))}
      </ul>

      <h3>Images</h3>
      <div className="image-gallery">
        {project.images.map((img, index) => (
          <img key={index} src={img} alt={`Project ${index}`} />
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ProjectDetails;
