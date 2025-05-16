import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">JET SETTERS</div>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Service</h3>
            <ul>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Coronavirus (COVID-19)</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Flight</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Our Work</h3>
            <ul>
              <li><a href="#">Packages</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact us</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Packages</h3>
            <ul>
              <li><a href="#">Europe</a></li>
              <li><a href="#">America</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact us</h3>
            <ul>
              <li><i className="fas fa-phone"></i> (+1) 555-555-5555</li>
              <li><i className="fas fa-envelope"></i> info@jetsetters.com</li>
              <li><i className="fas fa-map-marker-alt"></i> 123 Somewhere Ave, New York</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 