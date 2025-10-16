import { VmLogo } from './vm-logo';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const whatsappLink = "https://wa.me/573138318683?text=Hola,%20Valentina.%20Quisiera%20saber%20más%20sobre%20tus%20planes.";

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <VmLogo className="h-12 text-primary" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://www.instagram.com/valentinamontero._/" target="_blank" rel="noopener noreferrer" aria-label="Visita nuestro Instagram">
            <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="#" aria-label="Visita nuestro Facebook">
            <Facebook className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="#" aria-label="Visita nuestro Twitter">
            <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
