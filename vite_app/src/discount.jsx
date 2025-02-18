import React, { useState, useEffect } from 'react';
import { FaShareAlt, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './discount.css';


const DiscountPage = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 45, seconds: 60 });
  const [scratched, setScratched] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { hours, minutes, seconds } = prevTime;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="discount-container">
      <div className="header-section">
        <div className="header-content">
          <h1>Exclusive Event Deals</h1>
          <p>Don't miss out on our biggest discounts ever!</p>
          <div className="timer">
            <span>{timeLeft.hours} Hours</span>
            <span>{timeLeft.minutes} Minutes</span>
            <span>{timeLeft.seconds} Seconds</span>
          </div>
        </div>
        <motion.img src="https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_640.jpg" alt="Event" className="event-image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}/>
      </div>

      <div className="exclusive-deals">
        <h2>Exclusive Deals</h2>
        <div className="deals-container">
          <motion.div className="deal-card" whileHover={{ scale: 1.05 }}>
            <h3>Wedding Package</h3>
            <p>$999 <span className="strike">$1,400</span></p>
            <button>Book Now</button>
          </motion.div>
          <motion.div className="deal-card" whileHover={{ scale: 1.05 }}>
            <h3>Concert Venue</h3>
            <p>$599 <span className="strike">$800</span></p>
            <button>Book Now</button>
          </motion.div>
          <motion.div className="deal-card" whileHover={{ scale: 1.05 }}>
            <h3>Corporate Event</h3>
            <p>$799 <span className="strike">$1,200</span></p>
            <button>Book Now</button>
          </motion.div>
        </div>
      </div>

      <div className="find-deal">
        <h2>Find Your Perfect Deal</h2>
        <div className="filter-options">
          <select>
            <option>All Events</option>
            <option>Weddings</option>
            <option>Concerts</option>
            <option>Corporate</option>
          </select>
          <input type="range" min="0" max="2000" />
          <select>
            <option>Best Deals</option>
            <option>Lowest Price</option>
          </select>
        </div>
      </div>

      <div className="scratch-share-container">
        <div className="scratch-win" onClick={() => setScratched(true)}>
          {scratched ? <p>Congratulations! You've won a discount!</p> : <FaGift size={50} />}
          {!scratched && <button className="scratch-btn">Scratch Now</button>}
        </div>

        <div className="share-section">
          <h3>Share & Save More</h3>
          <p>Share this deal with your friends and get an additional 10% off!</p>
          <div className="share-icons">
            <FaShareAlt size={30} />
          </div>
        </div>
      </div>

      <div className="recommended-section">
        <h2>Recommended For You</h2>
        <div className="recommendations">
          <div className="recommend-card perfect-match">
            <h4>Garden Wedding</h4>
            <span>Perfect Match</span>
            <button>View Deal</button>
          </div>
          <div className="recommend-card new">
            <h4>Beach Party</h4>
            <span>New</span>
            <button>View Deal</button>
          </div>
          <div className="recommend-card popular">
            <h4>Birthday Bash</h4>
            <span>Popular</span>
            <button>View Deal</button>
          </div>
          <div className="recommend-card last-minute">
            <h4>Corporate Meeting</h4>
            <span>Last Minute</span>
            <button>View Deal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPage;
