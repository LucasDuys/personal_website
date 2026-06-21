export const EASE = {
  expoOut: 'expo.out',
  expoInOut: 'expo.inOut',
  backOut: 'back.out(2.5)',
  smooth: 'power3.out',
} as const;

export const REVEAL = {
  heading: {
    yPercent: 110,
    rotationZ: 3,
    opacity: 0,
    duration: 1.0,
    ease: EASE.expoOut,
    stagger: 0.08,
  },
  paragraph: {
    yPercent: 100,
    opacity: 0,
    duration: 0.8,
    ease: EASE.expoOut,
    stagger: 0.04,
  },
  card: {
    y: 60,
    opacity: 0,
    scale: 0.97,
    duration: 0.9,
    ease: EASE.expoOut,
    stagger: 0.12,
  },
  tag: {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: EASE.backOut,
    stagger: 0.03,
  },
  fadeUp: {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: EASE.expoOut,
    stagger: 0.06,
  },
} as const;
