import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

// Global SEO Metadata
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://storyverse.com'),
  title: {
    default: 'StoryVerse - Discover & Share Short Fiction Stories',
    template: '%s | StoryVerse'
  },
  description: 'Explore thousands of captivating short fiction stories across Fantasy, Sci-Fi, Romance, Thriller, and more. Read, write, and share your stories with a vibrant community of readers and authors.',
  keywords: ['short stories', 'fiction', 'creative writing', 'fantasy stories', 'sci-fi stories', 'romance stories', 'thriller stories', 'online reading', 'story sharing', 'writers community'],
  authors: [{ name: 'StoryVerse Team' }],
  creator: 'StoryVerse',
  publisher: 'StoryVerse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'StoryVerse',
    title: 'StoryVerse - Discover & Share Short Fiction Stories',
    description: 'Explore thousands of captivating short fiction stories across Fantasy, Sci-Fi, Romance, Thriller, and more. Read, write, and share your stories with a vibrant community.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StoryVerse - Short Fiction Stories',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StoryVerse - Discover & Share Short Fiction Stories',
    description: 'Explore thousands of captivating short fiction stories. Read, write, and share with our community.',
    images: ['/og-image.jpg'],
    creator: '@storyverse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  category: 'entertainment',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* IMPORTANT: Apply theme to <body> via provider */}
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
