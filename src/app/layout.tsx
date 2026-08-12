import type { Metadata } from 'next';
import { alegreya, alegreyaSans } from '@/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lucasduys.com'),
  title: 'Lucas Duys | Founder and AI Engineer',
  description: 'Lucas Duys is a founder and AI engineer in Eindhoven, building a stealth startup and joining Antler ONE in September 2026.',
  keywords: ['Lucas Duys', 'founder', 'AI engineer', 'Antler ONE', 'TU Eindhoven', 'Stacklink', 'Cape.io'],
  authors: [{ name: 'Lucas Duys', url: 'https://lucasduys.com' }],
  creator: 'Lucas Duys',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Lucas Duys | Founder and AI Engineer',
    description: 'A visual CV of products, systems, and proof.',
    type: 'profile',
    url: 'https://lucasduys.com',
    locale: 'en_US',
    siteName: 'Lucas Duys',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Duys | Founder and AI Engineer',
    description: 'A visual CV of products, systems, and proof.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Duys',
  url: 'https://lucasduys.com',
  jobTitle: 'Founder and AI Engineer',
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'Eindhoven University of Technology',
  },
  email: 'mailto:lucas.duys@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/lucas-duys/',
    'https://github.com/LucasDuys',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${alegreyaSans.variable} ${alegreya.variable}`}>
      <head>
        {/* Reveal styles only engage once JS is confirmed, so a visitor
            without it sees every section, immediately. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('rv')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
