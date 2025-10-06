'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSavedWorkoutPlans } from './actions';
import { WorkoutPlan } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { PlusCircle, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setIsLoadingPlans(true);
      getSavedWorkoutPlans(user.uid)
        .then(setPlans)
        .finally(() => setIsLoadingPlans(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
        <div className="container py-12">
            <Skeleton className="h-10 w-1/2 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline">¡Bienvenido de nuevo, {user.displayName}!</h1>
        <p className="text-muted-foreground">Aquí están tus planes de entrenamiento guardados. ¿Listo para sudar?</p>
      </div>

      {isLoadingPlans && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      )}

      {!isLoadingPlans && plans.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary"/>
                    {plan.title}
                </CardTitle>
                <CardDescription>
                  Guardado el {plan.createdAt && format(new Date(plan.createdAt), 'd MMMM, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{plan.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!isLoadingPlans && plans.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">Aún no tienes planes guardados</h3>
            <p className="text-muted-foreground mt-2 mb-4">
                Parece que no has guardado ningún plan de entrenamiento.
            </p>
            <Button asChild>
                <Link href="/workout-generator">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear un Nuevo Plan
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
