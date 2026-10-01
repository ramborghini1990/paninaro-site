import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Paninaro di Sassi | Street Food Notturno a Torino',
  description:
    'Il miglior cibo di strada notturno a Torino. Panini, kebab, salse e birre. Aperto fino a tardi.',
  openGraph: {
    title: 'Paninaro di Sassi',
    description: 'Street food notturno a Torino. Panini freschi, salse fatte in casa.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
