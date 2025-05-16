import React from 'react';
import './DestinationSection.css';
import destinationsData from './data/destinations.json';

const DestinationSection = () => {
  return (
    <section className="destination-section">
      <h2 className="section-title">CHOOSE YOUR NEXT DESTINATION</h2>
      <h3 className="section-subtitle">EXPLORE BY DESTINATION</h3>
      
      <div className="destinations-grid">
        {destinationsData.destinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <div className="destination-image">
              <img src={destination.image} alt={destination.name} />
              <div className="destination-rating">
                <span className="star">★</span>
                <span>{destination.rating}</span>
              </div>
            </div>
            <div className="destination-info">
              <h4>{destination.name}</h4>
              <p>Starts from ${destination.price}/p.p</p>
              <button className="book-now">BOOK NOW</button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="explore-more">Explore more</button>
    </section>
  );
};

export default DestinationSection; 