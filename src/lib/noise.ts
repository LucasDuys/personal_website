import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

export function simplex2D(x: number, y: number): number {
  return noise2D(x, y);
}
