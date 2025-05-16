import React from 'react';
import HeroSection from './HeroSection';
import DestinationSection from './DestinationSection';
import CruiseLineSection from './CruiseLineSection';
import PartnerSection from './PartnerSection';
import NewsletterSection from './NewsletterSection';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <DestinationSection />
      <CruiseLineSection />
      <PartnerSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage; 