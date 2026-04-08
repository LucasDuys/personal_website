import type { Metadata } from 'next';
import { jetbrainsMono, spaceGrotesk } from '@/styles/fonts';
import { Providers } from '@/components/layout/Providers';
import { LayoutShell } from '@/components/layout/LayoutShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lucas Duys - CS & AI Developer',
  description: 'CS & Engineering student at TU Eindhoven building AI tools. Creator of Pitchr.live (Built at HackEurope Paris) and Stacklink.nl (RAG system). AI Intern at cape.io.',
  keywords: ['Lucas Duys', 'developer', 'AI', 'RAG', 'portfolio', 'TU Eindhoven', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Lucas Duys' }],
  creator: 'Lucas Duys',
  openGraph: {
    title: 'Lucas Duys - CS & AI Developer',
    description: 'Building at the intersection of engineering and AI.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lucas Duys',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Duys - CS & AI Developer',
    description: 'Building at the intersection of engineering and AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Duys',
  jobTitle: 'CS & Engineering Student',
  affiliation: {
    '@type': 'Organization',
    name: 'TU Eindhoven',
  },
  email: 'lucas.duys@gmail.com',
  sameAs: ['https://www.linkedin.com/in/lucas-duys/'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
