import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Projects.css"; // ✅ Projects-specific CSS
import Footer from "./footer";
import Navbar from "./navbar";
import loaderGif from "./assets/loader.gif";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ Loader state

  useEffect(() => {
    axios
      .get("https://eventura-3.onrender.com/projects")
      .then((response) => {
        setProjects(response.data);
        setLoading(false); // ✅ Data load hone ke baad loader hatao
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const interval = setInterval(() => {
        setFeaturedIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [projects]);

  const categorizedProjects = {
    recent: projects.filter((p) => p.status === "recent"),
    ongoing: projects.filter((p) => p.status === "ongoing"),
    upcoming: projects.filter((p) => p.status === "upcoming"),
  };

  return (
    <>
      <Navbar />

      {/* ✅ Custom Loader for Projects Page */}
      {loading && (
        <div className="projects-loader-overlay">
          <img src={loaderGif} alt="Loading..." className="projects-loader" />
        </div>
      )}

      {/* ✅ Blur effect when loading */}
      <div className={`projects-wrapper ${loading ? "projects-blur-background" : ""}`}>
        {/* Featured Project Container */}
        {projects.length > 0 && (
          <div className="featured-project-container">
            <h2>PROJECTS</h2>
            <div className="featured-content">
              <img src={projects[featuredIndex].images} alt={projects[featuredIndex].title} />
              <div className="details">
                <h3>{projects[featuredIndex].title}</h3>
                <p>{projects[featuredIndex].description}</p>
                <p>
                  <strong>Client:</strong> {projects[featuredIndex].client.name}
                </p>
                <p>
                  <strong>Manager:</strong> {projects[featuredIndex].manager}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid Section */}
        <div className="projects-list-container">
          {Object.entries(categorizedProjects).map(([category, items]) => (
            <div key={category} className="projects-category">
              <h2>{category.toUpperCase()} PROJECTS</h2>
              <div className="projects-grid">
                {items.map((project) => (
                  <div key={project.title} className="project-card">
                    <img src={project.images} alt={project.title} />
                    <div className="overlay3">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <button>View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Projects;

