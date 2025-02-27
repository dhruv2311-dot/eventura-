import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Projects.css";
import Footer from "./footer";
import Navbar from "./navbar";
import loaderGif from "./assets/loader.gif";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://eventura-3.onrender.com/projects")
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
  }, []);

  // ✅ Auto-slide Banner every 3 seconds
  useEffect(() => {
    if (projects.length > 0) {
      const interval = setInterval(() => {
        setFeaturedIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [projects]);

  // ✅ Categorize projects
  const categorizedProjects = {
    recent: projects.filter((p) => p.status === "recent"),
    ongoing: projects.filter((p) => p.status === "ongoing"),
    upcoming: projects.filter((p) => p.status === "upcoming"),
  };

  return (
    <>
      <Navbar />

      {/* ✅ Loader while fetching projects */}
      {loading && (
        <div className="projects-loader-overlay">
          <img src={loaderGif} alt="Loading..." className="projects-loader" />
        </div>
      )}

      {/* ✅ Banner Section - Auto Sliding Projects */}
      
      <div className={`projects-wrapper ${loading ? "projects-blur-background" : ""}`}>
      {projects.length > 0 && (
        <div className="featured-project-container">
          <h2>PROJECTS</h2>
          <div className="featured-content">
            <img src={projects[featuredIndex].images[0]} alt={projects[featuredIndex].title} />
            <div className="details">
              <h3>{projects[featuredIndex].title}</h3>
              <p>{projects[featuredIndex].description}</p>
              <p><strong>Client:</strong> {projects[featuredIndex].client?.name || "Unknown"}</p>
              <p><strong>Manager:</strong> {projects[featuredIndex].manager || "Not Assigned"}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          
        </div>
      )}
    </div>
      {/* ✅ Projects Grid Section */}
      <div className="projects-wrapper">
        {Object.entries(categorizedProjects).map(([category, items]) => (
          <div key={category} className="projects-category">
            <h2>{category.toUpperCase()} PROJECTS</h2>
            <div className="projects-grid">
              {items.map((project) => (
                <div key={project._id || Math.random()} className="project-card">
                  <img 
                    src={project.images?.[0] || "https://via.placeholder.com/300"} 
                    alt={project.title} 
                  />
                  <div className="overlay3">
                    <h3>{project.title}</h3>
                    <p>{project.description?.substring(0, 80) || "No description available"}...</p>
                    <Link to={`/projects/${project._id}`}>
                      <button>View</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Projects;
