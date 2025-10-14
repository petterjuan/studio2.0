'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { Menu, Zap } from 'lucide-react';
import { useState } from 'react';
import { VmLogo } from './vm-logo';
import { AuthButton } from '../auth-button';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/plan-generator', label: 'Crear Plan' },
  { href: '/coaching', label: 'Coaching' },
  { href: '/blog', label: 'Blog' },
  { href: '/products', label: 'Productos' },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

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
        <div className="md:hidden mr-4">
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
                    <Button asChild>
                      <Link href="/products/muscle-bites-snacks" onClick={() => setSheetOpen(false)}>
                        <Zap className="mr-2 h-4 w-4" />
                        ¡Lo Quiero Ahora!
                      </Link>
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        <Link href="/" className="mr-6 flex items-center" onClick={() => setSheetOpen(false)}>
          <VmLogo className="h-10 text-primary" />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Button asChild className="hidden sm:inline-flex shadow-sm hover:shadow-primary/40">
                <Link href="/products/muscle-bites-snacks">
                  <Zap className="mr-2 h-4 w-4" />
                  ¡Lo Quiero Ahora!
                </Link>
            </Button>
           <AuthButton />
        </div>
      </div>
    </header>
  );
}
