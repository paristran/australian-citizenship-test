import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
          backgroundColor: '#fff',
          background: 'linear-gradient(to bottom, #00843D 0%, #006B32 100%)',
          padding: '80px',
        }}
      >
        {/* Main Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '60px 80px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Australian Flag Emoji */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '30px',
            }}
          >
            🇦🇺
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#00843D',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Australian Citizenship
          </div>
          
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#00843D',
              marginBottom: '30px',
              textAlign: 'center',
            }}
          >
            Practice Test
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#666',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            250+ Free Practice Questions
          </div>
          
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#00843D',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '24px',
              fontWeight: '600',
            }}
          >
            ✓ Based on "Our Common Bond"
          </div>
        </div>
        
        {/* Website URL */}
        <div
          style={{
            marginTop: '40px',
            fontSize: '24px',
            color: 'white',
            opacity: 0.9,
          }}
        >
          GetCitizenship.com.au
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
