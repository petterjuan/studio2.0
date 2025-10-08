'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { Menu, Zap } from 'lucide-react';
import { useState, useTransition } from 'react';
import { VmLogo } from './vm-logo';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '@/app/products/actions';
import { getProductByHandle } from '@/lib/products';
import { Loader2 } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/coaching', label: 'Coaching' },
  { href: '/blog', label: 'Blog' },
  { href: '/products', label: 'Productos' },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleBuyNow = async () => {
    startTransition(async () => {
      try {
        const product = await getProductByHandle('muscle-bites-snacks');
        if (product) {
          await createCheckoutSession(product);
        } else {
            throw new Error('Producto no encontrado');
        }
      } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: '¡Oh, no! Algo salió mal.',
            description: 'No se pudo redirigir a la página de pago. Por favor, inténtalo de nuevo.',
        });
      }
    });
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        pathname === href ? 'text-primary' : 'text-muted-foreground'
      )}
      onClick={() => setSheetOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center" onClick={() => setSheetOpen(false)}>
          <VmLogo className="h-10 text-primary" />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Button onClick={handleBuyNow} disabled={isPending} className="hidden sm:inline-flex shadow-sm hover:shadow-primary/40">
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                    </>
                ) : (
                    <>
                        <Zap className="mr-2 h-4 w-4" />
                        ¡Lo Quiero Ahora!
                    </>
                )}
            </Button>
           <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Abrir Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 p-4">
                    <Link href="/" className="mr-6 flex items-center space-x-2 mb-4" onClick={() => setSheetOpen(false)}>
                        <VmLogo className="h-10 text-primary" />
                    </Link>
                    {navLinks.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}
                    <Button onClick={handleBuyNow} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-4 w-4" />
                                ¡Lo Quiero Ahora!
                            </>
                        )}
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
