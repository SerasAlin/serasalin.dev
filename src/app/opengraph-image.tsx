import { ImageResponse } from 'next/og';
import { profile } from '@/content/profile';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${profile.name} — ${profile.role}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0b0d12 0%, #12151d 65%, #1c2334 100%)',
        color: '#e6e9f1',
        padding: '80px 90px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: 'linear-gradient(140deg, #8794ff, #4b5cff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0b0d12',
            fontFamily: 'monospace',
            fontWeight: 700,
          }}
        >
          &gt;_
        </div>
        <span style={{ fontSize: 30, opacity: 0.75, letterSpacing: -0.5 }}>serasalin.dev</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 40, opacity: 0.8 }}>{profile.headline}</div>
      </div>
      <div style={{ fontSize: 24, opacity: 0.6, display: 'flex', gap: 24 }}>
        <span>{profile.role}</span>
        <span>·</span>
        <span>{profile.location}</span>
      </div>
    </div>,
    { ...size },
  );
}
