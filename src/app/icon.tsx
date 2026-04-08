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
          color: '#E8E6E3',
          fontSize: 20,
          fontWeight: 600,
          fontFamily: 'monospace',
          letterSpacing: '-1px',
          borderRadius: 6,
          border: '1px solid #1F1F26',
        }}
      >
        LD
      </div>
    ),
    { ...size }
  );
}
