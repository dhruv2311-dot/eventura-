import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Blogs.css";
import Footer from "./footer";
import Navbar from "./Navbar";
import loaderGif from "./assets/loader.gif";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://eventura-4.onrender.com/blogs") 
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      {loading && (
        <div className="blogs-loader-overlay">
          <img src={loaderGif} alt="Loading..." className="blogs-loader" />
        </div>
      )}

      <div className={`blogs-container ${loading ? "blogs-blur-background" : ""}`}>
        <section className="our-blogs">
          <h2>OUR BLOGS</h2>
          <p>Stay updated with the latest trends and insights in the event industry.</p>
          <div className="blog-images">
            <img src="https://bloggerspassion.com/wp-content/uploads/2020/06/event-blogging.webp" alt="Blog 1" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBtAckMwy5uTqdAGiIWlFGCyMXvosNs-dYiw&s" alt="Blog 2" />
          </div>
        </section>

        {/* ✅ Trending Section - 6 Blogs */}
        <section className="trending">
          <h2>TRENDING, WATCH WITH US</h2>
          <div className="trending-grid">
            {blogs.slice(0, 6).map((blog) => (
              <div className="trending-card" key={blog._id}>
                <img src={blog.image} alt={blog.title} />
                <div className="trending-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.author} • {new Date(blog.date).toDateString()}</p>
                  {/* ✅ Content Null Check (Prevent Errors) */}
                  <p>{blog.content ? blog.content.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "..." : "No description available."}</p>
                  <button onClick={() => navigate(`/blog/${blog._id}`)}>Know More</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ Latest Blogs Section - 4 Blogs */}
        <section className="latest-blogs">
          <h2>THE LATEST BLOGS</h2>
          <div className="latest-grid">
            {blogs.slice(6, 10).map((blog) => (
              <div className="latest-card" key={blog._id}>
                <img src={blog.image} alt={blog.title} />
                <div className="latest-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.author} • {new Date(blog.date).toDateString()}</p>
                  {/* ✅ Content Null Check (Prevent Errors) */}
                  <p>{blog.content ? blog.content.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "..." : "No description available."}</p>
                  <button onClick={() => navigate(`/blog/${blog._id}`)}>Know More</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Blogs;


