import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PrivacyFloatingButton } from '@/components/PrivacyFloatingButton';
import { CrisisSupportButton } from '@/components/CrisisSupportButton';
import { WelcomeOverlay } from '@/components/WelcomeOverlay';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#15733E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Ping Check: How's Your Connection With Yourself? — CHMSU PSITS & Psychological Society",
  description:
    'An anonymous, intentional space for CHMSU students to pause, reflect, vent thoughts safely, and access campus mental health support. In partnership with The CHMSU Psychological Society.',
  keywords: [
    'mental health',
    'student wellness',
    'CHMSU',
    'PSITS',
    'Psychological Society',
    'check-in',
    'mindfulness',
    'anonymous vent',
  ],
  authors: [{ name: 'CHMSU PSITS & Psychological Society' }],
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
  openGraph: {
    title: "Ping Check: How's Your Connection With Yourself?",
    description:
      'An anonymous, intentional space for CHMSU students to pause, reflect, vent thoughts safely, and access campus mental health support.',
    type: 'website',
    images: ['/assets/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="app-wrapper">
          <Header />
          <main id="main-content" className="main-container" role="main">
            {children}
          </main>
          <Footer />
          <PrivacyFloatingButton />
          <CrisisSupportButton />
        </div>
        <WelcomeOverlay />
      </body>
    </html>
  );
}
