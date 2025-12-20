import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from URL
    const title = searchParams.get('title') || 'Untitled Story';
    const author = searchParams.get('author') || 'Unknown Author';
    const genre = searchParams.get('genre') || 'Fiction';
    
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
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
            }}
          />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '30px',
                fontSize: 28,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              TheStoryBits
            </div>
            
            <div
              style={{
                display: 'flex',
                fontSize: 56,
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '20px',
                maxWidth: '900px',
                textAlign: 'center',
              }}
            >
              {title}
            </div>
            
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                fontWeight: 500,
                color: '#e0e0e0',
                marginBottom: '20px',
              }}
            >
              by {author}
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 28px',
                backgroundColor: 'rgba(102, 126, 234, 0.9)',
                borderRadius: '50px',
                fontSize: 20,
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
