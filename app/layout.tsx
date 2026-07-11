import type {Metadata} from 'next';
import { Inter, Amiri } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kitab Digital - Al-Quran, Hadits & Asisten AI',
  description: 'Aplikasi Kitab Digital interaktif lengkap dengan Al-Quran Kemenag, Terjemahan Indonesia, Tafsir Hadits Arbain, Tasbih Digital, dan Penjelasan Ustadz AI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${inter.variable} ${amiri.variable}`}>
      <body className="font-sans antialiased bg-[#faf8f5] text-stone-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
