import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get('https://eventura-3.onrender.com/projects')
      .then(response => {
        const recentProjects = response.data.filter(project => project.status === 'recent');
        setProjects(recentProjects);
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [projects]);

  if (projects.length === 0) {
    return <div>Loading...</div>;
  }

  const currentProject = projects[currentIndex];

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <>
      <div className="carousel-container">
        <h2>PROJECTS</h2>
        <div className="carousel-content">
          <div className="project-details">
            <h3>{renderValue(currentProject.title)}</h3>
            <p>{renderValue(currentProject.description)}</p>
            <p><strong>Date:</strong> {renderValue(currentProject.date)}</p>
            <p><strong>Client:</strong> {renderValue(currentProject.client)}</p>
            <p><strong>Category:</strong> {renderValue(currentProject.category)}</p>
            <p><strong>Manager:</strong> {renderValue(currentProject.manager)}</p>
          </div>
          <div className="project-images">
            {Array.isArray(currentProject.images) ? (
              currentProject.images.map((img, index) => (
                <img key={index} src={img} alt={`Project ${index + 1}`} />
              ))
            ) : (
              <img src={currentProject.images} alt={currentProject.title} />
            )}
          </div>
        </div>
        <div className="dots">
          {projects.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={currentIndex === index ? 'active' : ''}
            ></span>
          ))}
        </div>
      </div>
      <div className="recent-projects-container">
        <h2 className="recent-projects-title">Our Recent Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <img
                src={Array.isArray(project.images) ? project.images[0] : project.images}
                alt={project.title}
                className="project-image"
              />
              <div className="project-overlay">
                <div>
                  <h3 className="project-title">{renderValue(project.title)}</h3>
                  <p className="project-category">{renderValue(project.category)}</p>
                </div>
                <button className="view-button">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;