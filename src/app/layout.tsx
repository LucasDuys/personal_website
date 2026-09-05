import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lucasduys.com'),
  title: 'Lucas Duys | Founder of Athren, AI engineer',
  description: 'Lucas Duys is the founder of Athren, autonomous conversion experimentation for growth teams, and an AI engineer in Eindhoven in the Antler ONE September 2026 cohort.',
  keywords: ['Lucas Duys', 'Athren', 'founder', 'AI engineer', 'Antler ONE', 'TU Eindhoven', 'Stacklink', 'Cape.io'],
  authors: [{ name: 'Lucas Duys', url: 'https://lucasduys.com' }],
  creator: 'Lucas Duys',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Lucas Duys | Founder of Athren, AI engineer',
    description: 'What I am building, and the record behind it.',
    type: 'profile',
    url: 'https://lucasduys.com',
    locale: 'en_US',
    siteName: 'Lucas Duys',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Duys | Founder of Athren, AI engineer',
    description: 'What I am building, and the record behind it.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Duys',
  url: 'https://lucasduys.com',
  jobTitle: 'Founder, Athren',
  worksFor: { '@type': 'Organization', name: 'Athren', url: 'https://athren.nl' },
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* The booking calendar loads its embed from Cal's CDN on demand. */}
        <link rel="preconnect" href="https://app.cal.com" />
        <link rel="preconnect" href="https://cal.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
