import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./blogDetails.css";
import Navbar from "./Navbar";
import Footer from "./footer";
import loaderGif from "./assets/loader.gif"; // ✅ Import Loader GIF

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loader State Added
  const API_URL = `https://eventura-4.onrender.com/blogs/${id}`;

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setBlog(data);
        setLoading(false); // ✅ Data Load Hone Ke Baad Loader Hide Karo
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // ✅ Extract YouTube Video ID from URL
  const getVideoId = (url) => {
    if (!url) return "";
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/\S+|shorts\/))([\w-]{11})/);
    return match ? match[1] : "";
  };

  return (
    <>
      <Navbar />

      {/* ✅ Loader GIF Show Hoga Jab Tak Data Load Nahi Ho Jata */}
      {loading ? (
        <div className="loader-container">
          <img src={loaderGif} alt="Loading..." className="loader-gif" />
        </div>
      ) : (
        <div className="blog-details-container">
          <h1>{blog.title}</h1>
          <p><strong>Author:</strong> {blog.author} | <strong>Date:</strong> {new Date(blog.date).toDateString()}</p>

          {/* ✅ Main Blog Image */}
          <img src={blog.image} alt={blog.title} className="blog-cover" />

          {/* ✅ Extra Images Gallery */}
          {blog.additional_images && blog.additional_images.length > 0 && (
            <div className="extra-images-gallery">
              <h3>More Images</h3>
              <div className="image-grid">
                {blog.additional_images.map((img, index) => (
                  <img key={index} src={img} alt={`Extra Image ${index + 1}`} className="extra-image" />
                ))}
              </div>
            </div>
          )}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

          {/* ✅ YouTube Video Embed */}
          {blog.video && getVideoId(blog.video) ? (
            <div className="video-container">
              <h3>Watch Related Video</h3>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${getVideoId(blog.video)}`}
                title="Blog Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "red" }}>Video not available</p>
          )}
        </div>
      )}

      <Footer />
    </>
  );
};

export default BlogDetails;