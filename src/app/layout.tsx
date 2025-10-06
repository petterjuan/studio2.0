import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/firebase/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import ShoppingAssistantChat from '@/components/shopping-assistant-chat';
import { PageTransition } from '@/components/page-transition';

export const metadata: Metadata = {
  title: 'VM Fitness Hub | Premium Nutrition & Coaching',
  description: 'Fuel your greatness with Muscle Bites, the ultimate meal prep solution by Valentina Montero. Personalized coaching and premium products for your fitness journey.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <Footer />
            <ShoppingAssistantChat />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
