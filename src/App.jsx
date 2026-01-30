import React from 'react';
import useLenis from './hooks/useLenis';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import Projects from './components/Projects';
import { AboutSection, EducationSection, ExperienceSection, SkillsSection, CertificationsSection } from './components/DetailedSections';
import Cursor from './components/Cursor';
import GalaxyBackground from './components/GalaxyBackground';

import Footer from './components/Footer';

function App() {
  useLenis();

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Dynamic Galaxy Background - Fixed and behind everything */}
      <GalaxyBackground />

      {/* Custom Cursor */}
      <Cursor />

      {/* Main Content Wrapper - Use relative to stack above the background */}
      <div className="relative z-10 space-y-0">
        <Hero />
        <BentoGrid />

        {/* New Premium Sections */}
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <Projects />
        <CertificationsSection />
        <SkillsSection />

        {/* Footer / Credits */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
