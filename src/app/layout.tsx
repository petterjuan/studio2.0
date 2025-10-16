import type { Metadata } from 'next';
import { Alegreya, Belleza, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/firebase/auth-provider';
import { DynamicShoppingAssistantChat } from '@/components/layout/client-components';

const fontBody = Alegreya({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const fontHeadline = Belleza({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
  display: 'swap',
});

const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JP Fitness Hub | AI Coaching & eCommerce',
  description: 'Eleva tu potencial con los recursos de fitness y nutrición de Juan Petter. Coaching personalizado y productos premium para tu viaje de transformación.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-body antialiased',
        fontBody.variable,
        fontHeadline.variable,
        fontCode.variable
      )}>
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
              <main className="flex-1">{children}</main>
            <Footer />
            <DynamicShoppingAssistantChat />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
