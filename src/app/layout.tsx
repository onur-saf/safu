import type { Metadata } from 'next';
import { Geist_Mono, Lexend_Deca } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '700'], // Regular and Bold
  variable: '--font-lexend-deca',
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Stay Safe',
  description: 'Stay Safe with Safu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${lexendDeca.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
