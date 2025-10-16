import { VmLogo } from './vm-logo';
import { Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export function Footer() {
  const whatsappLink = "https://wa.me/15129794797?text=Hola%2C%20Valentina.%20Tengo%20una%20pregunta.";

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <VmLogo className="h-12 text-primary" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://www.instagram.com/valentmontero" target="_blank" rel="noopener noreferrer" aria-label="Visita nuestro Instagram">
            <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="#" aria-label="Visita nuestro Facebook">
            <Facebook className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Contáctanos por WhatsApp">
            <FaWhatsapp className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
