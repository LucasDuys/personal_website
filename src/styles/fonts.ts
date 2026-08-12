import { Alegreya, Alegreya_Sans } from 'next/font/google';

export const alegreyaSans = Alegreya_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700', '800'],
});
