import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Note: Make sure to include Font Awesome in your main HTML file:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <Link to="/">
              <img src="/images/logo.png" alt="JET SETTERS" className="logo-image" />
            </Link>
          </div>
          <div className="footer-about">
            <p>Discover extraordinary cruise experiences with us. We've helped thousands of travelers create unforgettable memories on the seas.</p>
          </div>
          <div className="connect-us">
            <h3>Connect with us</h3>
            <div className="social-links">
              <a href="https://facebook.com/jetsetters" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/jetsetters" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com/jetsetters" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/jetsetters" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://youtube.com/jetsetters" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li><Link to="/cruise-booking">Cruise Booking</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/covid-updates">COVID-19 Updates</Link></li>
              <li><Link to="/flights">Flights</Link></li>
              <li><Link to="/special-offers">Special Offers</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/blog">Travel Blog</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Popular Destinations</h3>
            <ul>
              <li><Link to="/destinations/caribbean">Caribbean</Link></li>
              <li><Link to="/destinations/mediterranean">Mediterranean</Link></li>
              <li><Link to="/destinations/alaska">Alaska</Link></li>
              <li><Link to="/destinations/hawaii">Hawaii</Link></li>
              <li><Link to="/destinations/bahamas">Bahamas</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="contact-list">
              <li>
                <i className="fas fa-envelope contact-icon"></i>
                <a href="mailto:bookings@jet-setters.us">bookings@jet-setters.us</a>
              </li>
              <li>
                <i className="fas fa-phone contact-icon"></i>
                <a href="tel:+18885813028">(+1) 888-581-3028</a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt contact-icon"></i>
                <a href="https://maps.google.com/?q=513+W+Bonaventure+Ave+Tracy,+CA+95391" target="_blank" rel="noopener noreferrer">
                  513 W Bonaventure Ave Tracy, CA 95391
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          &copy; {currentYear} JET SETTERS. All rights reserved.
          <span className="legal-links">
            <Link to="/privacy">Privacy Policy</Link> | 
            <Link to="/terms">Terms of Service</Link> | 
            <Link to="/cookies">Cookie Policy</Link>
          </span>
        </div>
        <div className="footer-badges">
          <Link to="/secure-booking" className="badge"><i className="fas fa-lock"></i> Secure Booking</Link>
          <Link to="/support" className="badge"><i className="fas fa-headset"></i> 24/7 Support</Link>
          <Link to="/privacy" className="badge"><i className="fas fa-shield-alt"></i> Privacy Protected</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 