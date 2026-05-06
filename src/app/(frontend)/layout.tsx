import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import '../globals.css';

const display = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${display.variable} ${bodyFont.variable} ${mono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
