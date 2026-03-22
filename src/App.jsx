import React from 'react';
import useLenis from './hooks/useLenis';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import Projects from './components/Projects';
import { AboutSection, EducationSection, ExperienceSection, CertificationsSection } from './components/DetailedSections';
import FloatingSkills from './components/FloatingSkills';
import Cursor from './components/Cursor';
import GalaxyBackground from './components/GalaxyBackground';
import JarvisBot from './components/JarvisBot';
import Footer from './components/Footer';

function App() {
  useLenis();

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Dynamic Galaxy Background */}
      <GalaxyBackground />

      {/* Custom Cursor */}
      <Cursor />

      {/* Main Content Wrapper */}
      <div className="relative z-10 space-y-0">
        <Hero />
        <BentoGrid />

        {/* Premium Sections */}
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <Projects />
        <CertificationsSection />

        {/* Interactive Floating Skills — replaces static SkillsSection */}
        <FloatingSkills />

        {/* Footer */}
        <Footer />
      </div>

      {/* Nova AI Assistant */}
      <JarvisBot />
    </div>
  );
}

export default App;
