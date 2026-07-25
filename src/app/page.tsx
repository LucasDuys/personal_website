'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Hero } from '@/components/sections/Hero';
import { LiveDemo } from '@/components/sections/LiveDemo';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { NavBar } from '@/components/layout/NavBar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { MobileMenu } from '@/components/layout/MobileMenu';

const SECTION_IDS = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const handleOpenCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const handleOpenMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const handleCloseMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <main>
      <NavBar
        activeSection={activeSection}
        onOpenCommandPalette={handleOpenCommandPalette}
        onOpenMobileMenu={handleOpenMobileMenu}
      />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        activeSection={activeSection}
      />

      <div id="hero">
        <Hero />
      </div>
      <LiveDemo />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
