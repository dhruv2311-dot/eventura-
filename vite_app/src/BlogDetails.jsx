import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./blogDetails.css";
import Navbar from "./Navbar";
import Footer from "./footer";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const API_URL = `https://eventura-4.onrender.com/blogs/${id}`;

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (!blog) return <h2>Loading...</h2>;

  return (
    <>
      <Navbar />
      <div className="blog-details-container">
        <h1>{blog.title}</h1>
        <p><strong>Author:</strong> {blog.author} | <strong>Date:</strong> {new Date(blog.date).toDateString()}</p>
        
        {/* ✅ Details Page में दूसरी Image Show होगी */}
        <img src={blog.detailImage} alt={blog.title} className="blog-cover" />

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.fullContent }} />

        {/* ✅ Video Embed होगा */}
        {blog.video && (
          <div className="video-container">
            <h3>Watch Related Video</h3>
            <iframe
              width="100%"
              height="400"
              src={blog.video}
              title="Blog Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BlogDetails;
