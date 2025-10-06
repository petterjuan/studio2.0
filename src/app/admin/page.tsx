'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllWorkoutPlans } from './actions';
import { WorkoutPlan } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type UserWorkoutPlan = WorkoutPlan & { userName: string; userEmail: string };

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<UserWorkoutPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.isAdmin) {
      setIsLoadingPlans(true);
      getAllWorkoutPlans()
        .then(setPlans)
        .finally(() => setIsLoadingPlans(false));
    }
  }, [user]);

  if (loading || !user || !user.isAdmin) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline">Panel de Administrador</h1>
        <p className="text-muted-foreground">Revisa todos los planes de entrenamiento generados por los usuarios.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Planes de Entrenamiento de Usuarios</CardTitle>
          <CardDescription>
            Una lista de todos los planes de entrenamiento guardados por usuarios en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPlans ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título del Plan</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Creado en</TableHead>
                  <TableHead>Días</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length > 0 ? plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.title}</TableCell>
                    <TableCell>
                        <div>{plan.userName}</div>
                        <div className="text-xs text-muted-foreground">{plan.userEmail}</div>
                    </TableCell>
                    <TableCell>{plan.createdAt && format(new Date(plan.createdAt), 'd MMM, yyyy')}</TableCell>
                    <TableCell>{plan.weeklySchedule.length}</TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No se encontraron planes de entrenamiento.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
