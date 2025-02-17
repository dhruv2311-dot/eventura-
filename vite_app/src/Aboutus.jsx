import "./AboutUs.css";
import { FaLightbulb, FaUsers, FaChartLine, FaRocket, FaGlobe, FaMobileAlt } from "react-icons/fa";
import founder from './assets/image.jpg';
const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Introduction Section */}
      <section className="introduction-section">
        <h1>About Eventura</h1>
        <p>Your perfect event, our expertise.</p>
      </section>

      {/* About My Website Section */}
      <section className="about-website">
        <h2>About My Website</h2>
        <p>
          Eventura is your go-to platform for finding and managing event venues seamlessly. 
          We help event organizers and hosts connect efficiently.
        </p>
        <button className="read-more">Read More</button>
      </section>

      {/* Our Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>To provide an effortless event planning experience through our platform.</p>
          <div className="mission-icons">
            <div className="icon-card">
              <FaLightbulb className="icon" />
              <p>Innovative Solutions</p>
            </div>
            <div className="icon-card">
              <FaUsers className="icon" />
              <p>Expert Team</p>
            </div>
            <div className="icon-card">
              <FaChartLine className="icon" />
              <p>Growth Focus</p>
            </div>
          </div>
        </div>
        <img src="https://static.vecteezy.com/system/resources/previews/003/396/738/non_2x/businessman-clicks-on-virtual-screen-mission-photo.jpg" alt="Mission" className="mission-image" />
      </section>

      {/* Our Vision Section */}
      <section className="vision-section">
        <h2>Our Vision</h2>
        <p>To be the global leader in event solutions, setting new standards for excellence.</p>
        <div className="vision-icons">
          <div className="icon-card">
            <FaRocket className="icon" />
            <p>Innovation First</p>
          </div>
          <div className="icon-card">
            <FaGlobe className="icon" />
            <p>Global Impact</p>
          </div>
          <div className="icon-card">
            <FaMobileAlt className="icon" />
            <p>Future Ready</p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <img src={founder} alt="Founder" className="founder-image" />
        <div>
          <h2>Meet Our Founder</h2>
          <p>
            Dhruv Sonagra, the visionary behind Eventura, is passionate about simplifying event planning 
            through technology and innovation.
          </p>
          <button className="read-more">Read More</button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
