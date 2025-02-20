import React from "react";
import "./landingpage.css"; // External CSS file
import logo from './assets/eventura.png';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom'; 
const LandingPage = () => {
    const navigate = useNavigate();
    const handlehome=()=>{
        navigate('/home')
      }
    const handleevents=()=>{
        navigate('/events')
      }
    const handlevenues=()=>{
        navigate('/venue')
      }
    const handleblogs=()=>{
        navigate('/blogs')
      }
     
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    return (
        <div>
           
            <nav className="navbar">
             
                <img src={logo} alt="logo" className="logo" />
                <ul className="nav-links">
                    <li onClick={handlehome}>Home</li>
                    <li onClick={handleevents}>Events</li>
                    <li onClick={handlevenues}>Venues</li>
                    <li>Services</li>
                    <li onClick={handleblogs}>Blog</li>
                </ul>
                <div className="auth-buttons">
                    {!isAuthenticated ? (
                        <button className="signin" onClick={() => loginWithRedirect()}>
                            Sign In
                        </button>
                    ) : (
                        <button className="signup" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                            Logout
                        </button>
                    )}
                </div>
            </nav>
           
            {/* Hero Section */}
            <header
                className="hero1"
                style={{ backgroundImage: `url("https://image.wedmegood.com/resized/720X/uploads/member/1550137/1604992621_IMG_20201110_WA0027.jpg")` }}
            >
                <h1>Your Event, Our Expertise</h1>
                <p>Plan your perfect event with us.</p>
                <div className="hero-buttons">
                    <button className="btn-primary">Explore Events</button>
                    <button className="btn-secondary" onClick={handlehome}>Get Started</button>
                </div>
            </header>

            {/* Events Section (Static) */}
            <section className="events">
                <h2>Events We Plan</h2>
                <div className="grid">
                    <div className="card">
                        <img src="https://plus.unsplash.com/premium_photo-1663076211121-36754a46de8d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHdlZGRpbmd8ZW58MHx8MHx8fDA%3D" alt="Wedding" />
                        <h3>Wedding</h3>
                    </div>
                    <div className="card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9bFQ7RD1YBvbTDjYxqbgqjlhQsXLjXVGbw&s" alt="Birthday" />
                        <h3>Birthday</h3>
                    </div>
                    <div className="card">
                        <img src="https://camcrewproduction.com/wp-content/uploads/2023/12/corporate-event-photographer.jpg" alt="Corporate Event" />
                        <h3>Corporate Event</h3>
                    </div>
                    <div className="card">
                        <img src="https://www.masala.com/cloud/2024/12/10/Yo-Yo-Honey-Singh-1.jpg" alt="Concert" />
                        <h3>Concert</h3>
                    </div>
                </div>
            </section>

            {/* Venues Section (Static) */}
            <section className="venues">
                <h2>Find Your Perfect Venue</h2>
                <div className="grid">
                    <div className="card">
                        <img src="https://t3.ftcdn.net/jpg/08/64/36/50/360_F_864365053_8g7HkpoQmY9VyDzYkQvnznvAlDELVAvS.jpg" alt="Grand Hall" />
                        <h3>Grand Hall</h3>
                    </div>
                    <div className="card">
                        <img src="https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg" alt="Garden View" />
                        <h3>Garden View</h3>
                    </div>
                    <div className="card">
                        <img src="https://images.stockcake.com/public/4/0/d/40d41688-913c-4dcc-a521-b3a096d28427_large/luxurious-banquet-hall-stockcake.jpg" alt="Luxury Banquet" />
                        <h3>Luxury Banquet</h3>
                    </div>
                    <div className="card">
                        <img src="https://m.media-amazon.com/images/I/61rKeg3aOmL.jpg" alt="Beach Side" />
                        <h3>Beach Side</h3>
                    </div>
                </div>
            </section>

            {/* Craft Event Section */}
            <section className="craft-event">
                <h2>Craft Your Dream Event</h2>
                <p>
                    Create unforgettable moments with Eventura. From elegant weddings to grand corporate
                    events, we bring your vision to life with precision and creativity.
                </p>
                <button className="btn-primary" onClick={handleevents}>Start Planning</button>
            </section>


            {/* Client Reviews Section (Static with Images) */}
            <section className="clients">
                <h2>What Our Clients Say</h2>
                <div className="grid">
                    <div className="client-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTRXMt4u-0ogRiCqL4Q58HljgJuKuhRApdMw&s" alt="Sarah Johnson" />
                        <p>"Amazing event planning experience!"</p>
                        <h4>- Sarah Johnson</h4>
                    </div>
                    <div className="client-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKUfm31ZveAiI4bt3cWeMPdpl3XSp7K__06w&s" alt="Michael Smith" />
                        <p>"Professional and well-organized!"</p>
                        <h4>- Michael Smith</h4>
                    </div>
                    <div className="client-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLo0dcqNh7zIsDSOhzcnPbM-nQSuESmRta2A&s" alt="Emily Davis" />
                        <p>"Loved the decor and services!"</p>
                        <h4>- Emily Davis</h4>
                    </div>
                    <div className="client-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThwTwpnvcL26DJX7kwl07swFYSGAJAa3HruQ&s" alt="John Williams" />
                        <p>"Highly recommend Eventura!"</p>
                        <h4>- John Williams</h4>
                    </div>
                </div>
            </section>

            {/* Trending Tips Section (Static with Images) */}
            <section className="trending-tips">
                <h2>Trending Tips & Inspiration</h2>
                <div className="grid">
                    <div className="tip-card">
                        <img src="https://m.media-amazon.com/images/I/61q4PUMQ+tL._AC_UF1000,1000_QL80_.jpg" alt="Wedding Planning" />
                        <h3>Ultimate Wedding Planning Guide</h3>
                        <p>Step-by-step tips to plan your dream wedding.</p>
                    </div>
                    <div className="tip-card">
                        <img src="https://cdn.shopify.com/s/files/1/0115/4056/1978/files/The_Most_Popular_Kid_s_Birthday_Party_Themes_for_your_Ten_Years_Old_Momo_Party_1024x1024.png?v=1714586474" alt="Party Themes" />
                        <h3>Top 10 Party Themes</h3>
                        <p>Creative themes to make your party memorable.</p>
                    </div>
                    <div className="tip-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7gr13-Lje3Cp0v4uBUUDrpcaV1sXiWmQN3g&s" alt="Venue Selection" />
                        <h3>How to Choose a Venue</h3>
                        <p>Key factors to consider for selecting a perfect venue.</p>
                    </div>
                    <div className="tip-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvlBxi7FLzxAtxr8VsAdouP8U9RotXcD6gJg&s" alt="Budget Tips" />
                        <h3>Event Budgeting Tips</h3>
                        <p>Ways to plan a great event within your budget.</p>
                    </div>
                </div>
            </section>
            
        </div>
            
    );
};

export default LandingPage;
