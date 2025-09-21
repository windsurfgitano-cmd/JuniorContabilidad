import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
            borderRadius: '32px',
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              marginBottom: '20px',
              borderRadius: '24px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ fontSize: '60px' }}>🧮</div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          TuContable
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '800px',
            lineHeight: '1.2',
          }}
        >
          Gestión contable simplificada
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#e2e8f0',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '18px' }}>Tareas</div>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#e2e8f0',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '18px' }}>Obligaciones</div>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#e2e8f0',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontSize: '18px' }}>Auditorías</div>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#e2e8f0',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '18px' }}>Clientes</div>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '8px',
            background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}