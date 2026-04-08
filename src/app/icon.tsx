import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#06060A',
          color: '#4ADE80',
          fontSize: 20,
          fontWeight: 700,
          fontFamily: 'monospace',
          letterSpacing: '-1px',
          borderRadius: 6,
        }}
      >
        LD
      </div>
    ),
    { ...size }
  );
}
