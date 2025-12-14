import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from URL
    const title = searchParams.get('title') || 'Untitled Story';
    const author = searchParams.get('author') || 'Unknown Author';
    const genre = searchParams.get('genre') || 'Fiction';
    const coverImage = searchParams.get('coverImage');
    
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
            backgroundColor: '#0a0a0a',
            backgroundImage: coverImage 
              ? `url(${coverImage})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* Overlay for better text readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                OneSitRead
              </div>
            </div>
            
            {/* Story Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '24px',
                maxWidth: '900px',
                textAlign: 'center',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {title}
            </div>
            
            {/* Author */}
            <div
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: '#e0e0e0',
                marginBottom: '16px',
              }}
            >
              by {author}
            </div>
            
            {/* Genre Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 32px',
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderRadius: '50px',
                fontSize: 24,
                fontWeight: 600,
                color: '#ffffff',
              }}
            >
              {genre}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
