import React from 'react';
import { Link } from '@inertiajs/react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section 
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/hero-bg.jpg)`
      }}
    >
      <div className="hero-content">
        <h2 className="subtitle">Discover Luxury at Sea</h2>
        <h1 className="title">Your Dream Cruise<br />Adventure Awaits</h1>
        
        <div className="search-bar">
          <div className="search-items">
            <div className="search-item">
              <div className="icon-label">
                <i className="fas fa-map-marker-alt"></i>
                <span>Location</span>
              </div>
              <input type="text" defaultValue="USA" />
            </div>

            <div className="divider"></div>

            <div className="search-item">
              <div className="icon-label">
                <i className="far fa-calendar"></i>
                <span>Date</span>
              </div>
              <input type="text" defaultValue="13 May, 2023" />
            </div>

            <div className="divider"></div>

            <div className="search-item">
              <div className="icon-label">
                <i className="fas fa-ship"></i>
                <span>Cruiseline</span>
              </div>
              <input type="text" defaultValue="Cunard" />
            </div>

            <div className="divider"></div>

            <div className="search-item">
              <div className="icon-label">
                <i className="fas fa-anchor"></i>
                <span>Departure Port</span>
              </div>
              <input type="text" defaultValue="Vancouvar" />
            </div>

            <div className="divider"></div>

            <div className="search-item">
              <div className="icon-label">
                <i className="fas fa-dollar-sign"></i>
                <span>Price Range</span>
              </div>
              <input type="text" defaultValue="$200-$500" />
            </div>

            <div className="divider"></div>

            <div className="search-item">
              <div className="icon-label">
                <i className="fas fa-sliders-h"></i>
                <span>Filters</span>
              </div>
              <button className="more-filters">More Filters</button>
            </div>
          </div>

          <Link href="/booking" className="search-button">
            <i className="fas fa-search"></i>
            Book Now
          </Link>
        </div>

        <div className="filter-section">
          <span className="filter-label">Other Filters (Apply)</span>
          <div className="filter-tags">
            <button className="filter-tag">Luxury</button>
            <button className="filter-tag">Family</button>
            <button className="filter-tag">Ocean View</button>
          </div>
        </div>

        <div className="hero-book-now-wrapper">
          <button className="hero-book-now">
            BOOK NOW
          </button>
          <div className="hero-book-now-shadow"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 