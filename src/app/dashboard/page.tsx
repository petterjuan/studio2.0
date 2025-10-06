'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Dumbbell } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container py-12">
            <Skeleton className="h-10 w-1/2 mb-8" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline">¡Bienvenido de nuevo, {user.displayName}!</h1>
        <p className="text-muted-foreground">Estás listo para tomar el control de tu viaje de fitness. Explora nuestros recursos.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            <Dumbbell className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold">Explorar Productos</h3>
            <p className="text-muted-foreground mt-2 mb-4 max-w-xs">
                Encuentra los suplementos y comidas perfectos para alcanzar tus metas.
            </p>
            <Button asChild>
                <Link href="/products">
                    Ir a la Tienda
                </Link>
            </Button>
        </div>
        <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            <Settings className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold">Gestionar tu Cuenta</h3>
            <p className="text-muted-foreground mt-2 mb-4 max-w-xs">
                Actualiza tu perfil y preferencias.
            </p>
            <Button variant="outline">
                Ajustes de Cuenta (Próximamente)
            </Button>
        </div>
      </div>
    </div>
  );
}
