import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import CommandPalette from '@/components/CommandPalette';
import GradientBackground from '@/components/GradientBackground';
import ReduxProvider from '@/components/ReduxProvider';
import { getMetadata } from '@/utils/seo';
import { GoogleAnalytics } from '@next/third-parties/google';


const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = getMetadata({
  title: 'SQL Beast - Premium SQL Formatter, Minifier & Query Analyzer',
  description: 'The ultimate online developer-focused SQL platform. Format, beautify, minify, validate, and analyze your SQL queries instantly. Supports PostgreSQL, MySQL, SQLite, MariaDB, and Oracle.',
  path: '',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>


      <body className="antialiased font-sans flex flex-col min-h-screen relative text-gray-900 dark:text-gray-100 bg-white dark:bg-[#07090e] selection:bg-brand-primary/30 transition-colors duration-300">
        <ReduxProvider>
          {/* Shifting Mesh Backdrops */}
          <GradientBackground />

          {/* Sticky Header */}
          <Navbar />

          {/* Central Core Pages Content */}
          <main className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12 z-10 relative">
            {children}
          </main>

          {/* Comprehensive Footer */}
          <Footer />

          {/* Toast Notifier Container */}
          <ToastProvider />

          {/* Ctrl+K Search Launcher */}
          <CommandPalette />
        </ReduxProvider>
        <GoogleAnalytics gaId="G-2Y0DSV87D7" />
      </body>
    </html>
  );
}
