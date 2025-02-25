import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Blogs.css";
import Footer from "./footer";
import Navbar from "./Navbar";
import loaderGif from "./assets/loader.gif"; // ✅ Import loader GIF

const Blogs = () => {
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [upcomingBlogs, setUpcomingBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loader state

  useEffect(() => {
    axios
      .get("https://eventura-4.onrender.com/blogs")
      .then((response) => {
        const published = response.data.filter((blog) => blog.status === "published");
        const upcoming = response.data.filter((blog) => blog.status === "upcoming");
        setPublishedBlogs(published);
        setUpcomingBlogs(upcoming);
        setLoading(false); // ✅ Data load hone ke baad loader hatao
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      {/* ✅ Loader Display */}
      {loading && (
        <div className="blogs-loader-overlay">
          <img src={loaderGif} alt="Loading..." className="blogs-loader" />
        </div>
      )}

      {/* ✅ Blur effect when loading */}
      <div className={`blogs-container ${loading ? "blogs-blur-background" : ""}`}>
        {/* Our Blogs Section */}
        <section className="our-blogs">
          <h2>OUR BLOGS</h2>
          <p>
            When it comes to the growing event space, logistics, brand engagement, and unique storytelling matter. 
            Stay updated with the latest insights, trends, and creative ideas in the event industry.
          </p>
          <div className="blog-images">
            <img src="https://bloggerspassion.com/wp-content/uploads/2020/06/event-blogging.webp" alt="Blog 1" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBtAckMwy5uTqdAGiIWlFGCyMXvosNs-dYiw&s" alt="Blog 2" />
          </div>
        </section>

        {/* Trending, Watch with Us */}
        <section className="trending">
          <h2>TRENDING, WATCH WITH US</h2>
          <div className="trending-grid">
            {publishedBlogs.map((blog, index) => (
              <div className="trending-card" key={index}>
                <img src={blog.image} alt={blog.title} />
                <div className="trending-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.author} • {new Date(blog.date).toDateString()}</p>
                  <p>{blog.content.substring(0, 100)}...</p>
                  <button>Know More</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Blogs */}
        <section className="latest-blogs">
          <h2>THE LATEST BLOGS</h2>
          <div className="latest-grid">
            {upcomingBlogs.map((blog, index) => (
              <div className="latest-card" key={index}>
                <img src={blog.image} alt={blog.title} />
                <div className="latest-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.author} • {new Date(blog.date).toDateString()}</p>
                  <p>{blog.content.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all">VIEW ALL</button>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Blogs;

