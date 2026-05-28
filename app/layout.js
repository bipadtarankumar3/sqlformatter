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

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SQL Beast",
  "operatingSystem": "Windows, macOS, Linux, Android, iOS",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Premium developer suite to format, minify, validate, and analyze SQL queries locally inside your browser sandbox.",
  "featureList": [
    "SQL Formatter & Beautifier with customizable indents",
    "SQL Minifier & Compressor",
    "Dangerous Query Protection & Syntax Validator",
    "Query Analyzer (Nested joins, metrics, and column stats)"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://sqlbeast.dev",
  "name": "SQL Beast",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://sqlbeast.dev/cheatsheet?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Format and Beautify SQL Queries",
  "description": "Steps to format, compress, or validate database statements using SQL Beast.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Paste SQL Statement",
      "text": "Paste your messy, nested SQL statement or script into the editor."
    },
    {
      "@type": "HowToStep",
      "name": "Choose Dialect and Style",
      "text": "Select your database dialect (PostgreSQL, MySQL, Oracle, SQL Server, etc.) and configure indentation properties."
    },
    {
      "@type": "HowToStep",
      "name": "Analyze or Minify (Optional)",
      "text": "Click minifier to single-line it, or query analyzer to parse join counts and metrics."
    },
    {
      "@type": "HowToStep",
      "name": "Copy Beautiful Output",
      "text": "Click copy or use keyboard shortcuts to fetch the cleaned code to your clipboard."
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is my SQL query secure? Does SQL Beast store my data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely not. All parsing, beautifying, and scanning are performed strictly on the client side inside your local browser sandbox. Your queries never touch our servers."
      }
    },
    {
      "@type": "Question",
      "name": "How does the Dangerous Query Shield work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our validator scans SQL text using localized patterns to find DELETE FROM or UPDATE without a WHERE keyword, or direct DROP/TRUNCATE statements, then shows high-visibility warnings before you copy."
      }
    },
    {
      "@type": "Question",
      "name": "Which SQL dialects are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard SQL, PostgreSQL, MySQL, SQLite, MariaDB, Oracle SQL (PL/SQL), and Microsoft SQL Server (T-SQL) through specialized formatting engines."
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://sqlbeast.dev" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
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
