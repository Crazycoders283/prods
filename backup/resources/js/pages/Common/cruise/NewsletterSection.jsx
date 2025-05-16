import React, { useState } from 'react';
import './NewsletterSection.css';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <div className="newsletter-text">
          <h2>GET CRUISE DEALS DIRECTLY IN YOUR INBOX</h2>
          <p>Sign up to get exclusive offers, discounts, and cruise tips straight to your inbox!</p>
        </div>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            <button type="submit" className="subscribe-button">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection; 