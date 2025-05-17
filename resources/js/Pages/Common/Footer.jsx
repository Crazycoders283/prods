import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Note: Make sure to include Font Awesome in your main HTML file:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <Link to="/" className="footer-logo-link">
              <div className="footer-logo">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="logo-icon"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M2 12h20"></path>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <h3 className="column-title">JET SETTERS</h3>
              </div>
            </Link>
            <p className="column-description">
              Extraordinary travel experiences for travelers that demand excellence, customization, and unforgettable memories.
            </p>
          </div>
          <div className="footer-column">
            <h3 className="column-title-sm">Travel</h3>
            <nav aria-label="Travel Navigation">
              <ul className="nav-list">
                <li>
                  <Link to="/cruises" className="nav-link">
                    Cruise
                  </Link>
                </li>
                <li>
                  <Link to="/flights" className="nav-link">
                    Flight
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="nav-link">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link to="/rental" className="nav-link">
                    Hotels
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="footer-column">
            <h3 className="column-title-sm">Resources</h3>
            <nav aria-label="Resources Navigation">
              <ul className="nav-list">
                <li>
                  <Link to="/destinations" className="nav-link">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="nav-link">
                    Travel Blog
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="nav-link">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="nav-link">
                    FAQs
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="footer-column">
            <h3 className="column-title-sm">Company</h3>
            <nav aria-label="Company Navigation">
              <ul className="nav-list">
                <li>
                  <Link to="/about" className="nav-link">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="nav-link">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="nav-link">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="nav-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="nav-link">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {currentYear} JET SETTERS. All rights reserved.</p>
          <div className="social-links">
            <Link
              to="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="social-icon"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Link>
            <Link
              to="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="X"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="social-icon"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link 
              to="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-link" 
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="social-icon"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 