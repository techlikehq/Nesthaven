import React from 'react';
import Hero from '../components/home/Hero';
import ScrollNarrative from '../components/home/ScrollNarrative'; // Cleanly imported right here
import FeaturedListings from '../components/home/FeaturedListings';
import TrustSection from '../components/home/TrustSection';
import HowItWorks from '../components/home/HowItWorks';
import NeighbourhoodSection from '../components/home/NeighbourhoodSection';
import { AgentSection, CTASection } from '../components/home/AgentCTASections';

export default function HomePage() {
  return (
    <main>
      <Hero />
      
      {/* Placed exactly here, right below the Hero section */}
      <ScrollNarrative />
      
      <FeaturedListings />
      <TrustSection />
      <HowItWorks />
      <NeighbourhoodSection />
      <AgentSection />
      <CTASection />
    </main>
  );
}
