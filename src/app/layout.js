import { Inter, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

// Configure Inter font (Helvetica-like alternative)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Configure Roboto Mono font for story content
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

// Global SEO Metadata
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://thestorybits.com'),
  title: {
    default: 'TheStoryBits - Bite-Sized Fiction Stories',
    template: '%s | TheStoryBits'
  },
  description: 'Discover captivating short fiction stories in bite-sized bits. Read, write, and share quick stories across all genres with a vibrant community.',
  keywords: ['short stories', 'story bits', 'quick reads', 'fiction', 'creative writing', 'storytelling', 'literature', 'bite-sized stories', 'fast reads', 'micro fiction'],
  authors: [{ name: 'TheStoryBits Team' }],
  creator: 'TheStoryBits',
  publisher: 'TheStoryBits',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'TheStoryBits',
    title: 'TheStoryBits - Bite-Sized Fiction Stories',
    description: 'Discover captivating short fiction stories in bite-sized bits. Read, write, and share quick stories across all genres.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TheStoryBits - Bite-Sized Fiction Stories',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheStoryBits - Bite-Sized Fiction Stories',
    description: 'Discover captivating short fiction stories in bite-sized bits. Perfect for quick reads.',
    images: ['/og-image.jpg'],
    creator: '@thestorybits',
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
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ESQL4YCGKW"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ESQL4YCGKW');
            `,
          }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon-g.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* IMPORTANT: Apply theme to <body> via provider */}
      <body className={`${inter.className} ${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
