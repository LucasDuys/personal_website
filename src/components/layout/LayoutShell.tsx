'use client';
import { useState, useCallback } from 'react';
import { Preloader } from './Preloader';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <div
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {children}
      </div>
    </>
  );
}
