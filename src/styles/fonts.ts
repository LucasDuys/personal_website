import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'block',
  weight: ['400', '500', '600', '700'],
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});
