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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://onesitread.com'),
  title: {
    default: 'OneSitRead - Short Fiction Stories You Can Finish in One Sitting',
    template: '%s | OneSitRead'
  },
  description: 'Discover captivating short fiction stories you can finish in one sitting. Read, write, and share bite-sized stories across all genres with a vibrant community.',
  keywords: ['short stories', 'one sitting reads', 'quick reads', 'fiction', 'creative writing', 'storytelling', 'literature', 'bite-sized stories', 'fast reads'],
  authors: [{ name: 'OneSitRead Team' }],
  creator: 'OneSitRead',
  publisher: 'OneSitRead',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'OneSitRead',
    title: 'OneSitRead - Short Fiction Stories You Can Finish in One Sitting',
    description: 'Discover captivating short fiction stories you can finish in one sitting. Read, write, and share bite-sized stories across all genres.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OneSitRead - Short Fiction Stories',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneSitRead - Short Fiction Stories You Can Finish in One Sitting',
    description: 'Discover captivating short fiction stories you can finish in one sitting. Perfect for quick reads.',
    images: ['/og-image.jpg'],
    creator: '@onesitread',
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
