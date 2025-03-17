import './globals.css';
import { Inter } from 'next/font/google';
import { LoginProvider } from '@/contexts/LoginContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Reminder App',
  description: 'A simple reminder application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoginProvider>
          {children}
        </LoginProvider>
      </body>
    </html>
  );
}
