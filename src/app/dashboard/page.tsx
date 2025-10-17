
'use client';

import { useAuth } from '@/firebase/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Dumbbell, CalendarCheck, Loader2 } from 'lucide-react';
import { getWorkoutPlansForUser } from './actions';
import type { WorkoutPlan } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoadingPlans, startTransition] = useTransition();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.uid) {
      startTransition(async () => {
        const userPlans = await getWorkoutPlansForUser(user.uid);
        setPlans(userPlans);
      });
    }
  }, [user, startTransition]);

  if (loading || !user) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-1/2 mb-8" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline">¡Bienvenido de nuevo, {user.displayName}!</h1>
        <p className="text-muted-foreground">Estás listo para tomar el control de tu viaje de fitness. Explora nuestros recursos.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle as="h2" className="flex items-center gap-2">
                        <CalendarCheck className="h-6 w-6 text-primary" />
                        <span>Mis Planes de Entrenamiento Guardados</span>
                    </CardTitle>
                    <CardDescription>
                        Aquí están los planes de entrenamiento que has generado y guardado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingPlans ? (
                         <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                         </div>
                    ) : plans.length > 0 ? (
                        <div className="space-y-4">
                            {plans.map(plan => (
                                <div key={plan.id} className="p-4 border rounded-lg">
                                    <h3 className="font-bold text-lg">{plan.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{plan.summary}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Creado el: {format(new Date(plan.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold">Aún no tienes planes guardados</h3>
                            <p className="text-muted-foreground mt-2 mb-4 max-w-xs">
                                ¡Crea tu primer plan de entrenamiento con nuestro motor de personalización!
                            </p>
                            <Button asChild>
                                <Link href="/plan-generator">
                                    Crear Mi Plan Ahora
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <div className="space-y-8">
            <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
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
            <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                <Settings className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">Gestionar tu Cuenta</h3>
                <p className="text-muted-foreground mt-2 mb-4 max-w-xs">
                    Actualiza tu perfil y preferencias.
                </p>
                <Button variant="outline" disabled>
                    Ajustes de Cuenta (Próximamente)
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
