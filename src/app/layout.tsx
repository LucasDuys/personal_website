import type { Metadata } from 'next';
import { jetbrainsMono, spaceGrotesk } from '@/styles/fonts';
import { Providers } from '@/components/layout/Providers';
import { CustomCursor } from '@/components/layout/CustomCursor';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lucas Duys — CS & AI Developer',
  description: 'CS & Engineering student at TU Eindhoven building AI tools. Creator of Pitchr.live and Stacklink.nl.',
  openGraph: {
    title: 'Lucas Duys — CS & AI Developer',
    description: 'Building at the intersection of engineering and AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
