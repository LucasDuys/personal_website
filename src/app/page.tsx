'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ParticleCanvas } from '@/components/canvas/ParticleCanvas';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { SynapseBridge } from '@/components/ui/SynapseBridge';
import { SecretTerminal } from '@/components/ui/SecretTerminal';
import { NavBar } from '@/components/layout/NavBar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { SideIndicator } from '@/components/layout/SideIndicator';
import { MobileMenu } from '@/components/layout/MobileMenu';

const SECTION_IDS = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track active section with IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    // Observe all sections once they appear in the DOM
    const timeout = setTimeout(() => {
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) observerRef.current?.observe(el);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      observerRef.current?.disconnect();
    };
  }, []);

  const handleOpenCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const handleOpenMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const handleCloseMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <main className="bg-[var(--bg)]">
      <ParticleCanvas />

      {/* Navigation */}
      <NavBar
        activeSection={activeSection}
        onOpenCommandPalette={handleOpenCommandPalette}
        onOpenMobileMenu={handleOpenMobileMenu}
      />
      <SideIndicator activeSection={activeSection} />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        activeSection={activeSection}
        onOpenCommandPalette={handleOpenCommandPalette}
      />
      <SecretTerminal />

      {/* 1. Hero */}
      <div id="hero">
        <Hero />
      </div>

      {/* Bridge: hero → about */}
      <SynapseBridge annotation="> loading profile..." />

      {/* 2. About */}
      <About />

      {/* Bridge: about → projects */}
      <SynapseBridge annotation="> cd ~/projects" />

      {/* 3. Projects */}
      <Projects />

      {/* Bridge: projects → skills */}
      <SynapseBridge annotation="> cat skills.json" />

      {/* 4. Skills */}
      <Skills />

      {/* Bridge: skills → experience */}
      <SynapseBridge annotation="> git log --oneline" />

      {/* 5. Experience */}
      <Experience />

      {/* Bridge: experience → contact */}
      <SynapseBridge annotation="> open mailto" />

      {/* 6. Contact */}
      <Contact />
    </main>
  );
}
