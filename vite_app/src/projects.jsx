import React, { useState, useEffect } from 'react';
import './projects.css';

const projects = [
  {
    title: 'beach wedding at sunset bay',
    description: 'A beautiful destination wedding surrounded by nature.',
    date: '1st March 23',
    client: 'Mr. George',
    category: 'Wedding',
    manager: 'Dewald Brewis',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiU5eEdbZYSEpneDxOGBcofL0AUnxwBDn_5w&s',
      'https://www.aliikauaiweddings.com/wp-content/uploads/2020/01/Sneak-peek-17-1800x1200.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNmv7TuaQZoIxH1BkNCT7PrDvtRo29DcfWHA&s'
    ]
  },
  {
    title: 'beach wedding at sunset bay ',
    description: 'An elegant evening for corporate networking and celebration.',
    date: '15th July 24',
    client: 'Global Corp',
    category: 'Corporate Event',
    manager: 'Anna Smith',
    images: [
      'https://www.kalkifashion.com/blogs/wp-content/uploads/2023/01/60e548b58a373a7f865900fd_04d99656_bf8a_4a2d_a2b2_30833018c575-1024x680.jpg',
      'https://www.bergreenphotography.com/wp-content/uploads/2018/11/destination-wedding-in-the-mountains-2-1.jpg',
      'https://cdn0.weddingwire.com/article/1003/original/1280/jpg/3001-vt-the-mountain-top-inn.jpeg'
    ]
  }
];

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel-container">
      <h2>PROJECTS</h2>
      <div className="carousel-content">
        <div className="project-details">
          <h3>{projects[currentIndex].title}</h3>
          <p>{projects[currentIndex].description}</p>
          <p><strong>Date:</strong> {projects[currentIndex].date}</p>
          <p><strong>Client:</strong> {projects[currentIndex].client}</p>
          <p><strong>Category:</strong> {projects[currentIndex].category}</p>
          <p><strong>Manager:</strong> {projects[currentIndex].manager}</p>
        </div>
        <div className="project-images">
          {projects[currentIndex].images.map((img, index) => (
            <img key={index} src={img} alt="Project" />
          ))}
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
  );
}
