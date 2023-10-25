import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import ConvexProvider from '@/providers/ConvexProvider';
import { icons } from '@/lib/icons';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Motion Clone',
  description: 'Motion Clone App built with Next.js',
  icons: icons,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexProvider>{children}</ConvexProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
