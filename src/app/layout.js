import { Inter, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
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
    default: 'TheStoryBits - Short Fiction Stories in Your Coffee Break',
    template: '%s | TheStoryBits'
  },
  description: 'Discover captivating short fiction that fits your schedule. Complete stories in 5-15 minutes across fantasy, thriller, romance, sci-fi, and more genres. No subscriptions, no cliffhangers - just great storytelling.',
  keywords: ['short stories', 'short fiction', 'quick reads', 'bite-sized stories', '5 minute stories', '15 minute reads', 'flash fiction', 'micro fiction', 'online stories', 'free stories', 'fantasy stories', 'thriller stories', 'romance stories', 'sci-fi stories', 'horror stories', 'creative writing', 'storytelling platform', 'read stories online', 'write stories', 'fiction community', 'coffee break reads'],
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
    title: 'TheStoryBits - Short Fiction Stories in Your Coffee Break',
    description: 'Complete stories in 5-15 minutes. Discover exceptional short fiction across all genres - fantasy, thriller, romance, and more. Free to read, ad-free experience.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TheStoryBits - Complete Short Fiction in Your Coffee Break',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thestorybits', // Added for better Twitter card targeting
    title: 'TheStoryBits - Short Fiction in Your Coffee Break',
    description: 'Complete stories in 5-15 min. Fantasy, thriller, romance & more. Free to read, zero ads.',
    images: ['/og-image.png'],
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
    google: 'your-google-site-verification-code', // Placeholder for Google Search Console
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  category: 'entertainment',
  applicationName: 'TheStoryBits',
  referrer: 'origin-when-cross-origin',
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
        <link rel="preconnect" href="https://cdn.pixabay.com" />
        <link rel="preconnect" href="https://i.pinimg.com" />
        <link rel="dns-prefetch" href="https://cdn.pixabay.com" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon-g.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* IMPORTANT: Apply theme to <body> via provider */}
      <body className={`${inter.className} ${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
