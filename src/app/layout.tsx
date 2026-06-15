import type { Metadata } from 'next';
import { jetbrainsMono, spaceGrotesk } from '@/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lucasduys.com'),
  title: 'Lucas Duys — Co-founder, Stacklink',
  description:
    'Lucas Duys — co-founder of Stacklink, building self-learning agentic infrastructure that finds any piece of company knowledge instantly and automates the repetitive work. AI Engineering Intern at cape.io. CS & Engineering at TU Eindhoven.',
  keywords: [
    'Lucas Duys',
    'Stacklink',
    'co-founder',
    'agentic infrastructure',
    'AI agents',
    'knowledge management',
    'AI infrastructure',
    'TU Eindhoven',
    'AI engineer',
  ],
  authors: [{ name: 'Lucas Duys' }],
  creator: 'Lucas Duys',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Lucas Duys — Co-founder, Stacklink',
    description:
      'Self-learning agentic infrastructure that finds any company knowledge instantly and automates the repetitive work. In pilot with the second-largest company in the Netherlands.',
    url: 'https://lucasduys.com',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lucas Duys',
    images: [{ url: '/images/me/stage-pitch.jpg', width: 2048, height: 1152, alt: 'Lucas Duys presenting Stacklink' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Duys — Co-founder, Stacklink',
    description: 'Self-learning agentic infrastructure for company knowledge — find anything instantly, automate the repetitive work.',
    images: ['/images/me/stage-pitch.jpg'],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Duys',
  jobTitle: 'Co-founder',
  worksFor: { '@type': 'Organization', name: 'Stacklink', url: 'https://stacklink.nl' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'TU Eindhoven' },
  url: 'https://lucasduys.com',
  email: 'lucas.duys@gmail.com',
  sameAs: ['https://www.linkedin.com/in/lucas-duys/'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
