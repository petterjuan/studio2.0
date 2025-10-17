
'use client';

import { useAuth } from '@/firebase/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useTransition } from 'react';
import { getAllWorkoutPlans, approveWorkoutPlan, denyWorkoutPlan } from './actions';
import { WorkoutPlan } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


type UserWorkoutPlan = WorkoutPlan & { 
    userName: string; 
    userEmail: string; 
    status: 'pending' | 'approved' | 'denied'; 
    aiRecommendation?: string;
    aiReason?: string;
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<UserWorkoutPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const [isUpdating, startUpdateTransition] = useTransition();
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect non-admins or logged-out users away.
    if (!loading) {
      if (!user || !user.isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Only fetch plans if the user is a confirmed admin and we haven't fetched yet.
    if (user?.isAdmin && !hasFetched.current) {
      hasFetched.current = true; // Prevents re-fetching
      setIsLoadingPlans(true);
      getAllWorkoutPlans()
        .then(setPlans)
        .catch(err => {
            console.error(err);
            setError("No se pudieron cargar los planes de entrenamiento.");
        })
        .finally(() => setIsLoadingPlans(false));
    } else if (!user?.isAdmin) {
        // If user is not admin, don't show loading state.
        setIsLoadingPlans(false);
    }
  }, [user]);

  const handleUpdateStatus = (planId: string, status: 'approved' | 'denied') => {
    setUpdatingPlanId(planId);
    startUpdateTransition(async () => {
      const action = status === 'approved' ? approveWorkoutPlan : denyWorkoutPlan;
      const result = await action(planId);
      if (result.success) {
        setPlans(prevPlans => prevPlans.map(p => p.id === planId ? { ...p, status } : p));
      } else {
        setError(result.error || 'Error al actualizar el estado.');
      }
      setUpdatingPlanId(null);
    });
  }

  // Initial loading state while we verify the user's session.
  if (loading || !user) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // If the user is somehow still here but not an admin, show nothing.
  if (!user.isAdmin) {
      return null;
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline flex items-center gap-3">
          <ShieldCheck className="h-8 w-8" />
          Panel de Administrador
        </h1>
        <p className="text-muted-foreground">Revisa, aprueba y gestiona todos los planes de entrenamiento generados.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle as="h2">Planes de Entrenamiento de Usuarios</CardTitle>
          <CardDescription>
            Usa la recomendación de la IA para acelerar el proceso de revisión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPlans ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="h-24 text-center text-red-500 flex items-center justify-center">
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Recomendación IA</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length > 0 ? plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                        <div className="font-medium">{plan.userName}</div>
                        <div className="text-xs text-muted-foreground">{plan.userEmail}</div>
                        <div className="text-xs text-muted-foreground mt-1">{plan.createdAt ? format(new Date(plan.createdAt), 'd MMM, yyyy') : 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto font-medium text-base">{plan.title}</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{plan.title}</DialogTitle>
                            <DialogDescription>{plan.summary}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {plan.weeklySchedule.map((day, i) => (
                              <div key={i} className="p-3 bg-muted/50 rounded-md border">
                                <p className="font-bold text-sm">{day.day}</p>
                                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{day.description}</p>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                        <Badge variant={plan.status === 'approved' ? 'default' : plan.status === 'denied' ? 'destructive' : 'secondary'}>
                            {plan.status}
                        </Badge>
                    </TableCell>
                     <TableCell className="text-center">
                       <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="sm" className="gap-2">
                              <Sparkles className="h-4 w-4" />
                              Analizar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle as="h2" className="flex items-center gap-2"><Sparkles />Análisis de la IA</DialogTitle>
                            <DialogDescription>
                              Recomendación automática basada en los objetivos y la seguridad del plan.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Recomendación:</span>
                                <Badge variant={plan.aiRecommendation === 'Approve' ? 'default' : 'destructive'}>
                                  {plan.aiRecommendation}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">Justificación:</h4>
                                <p className="text-sm text-muted-foreground">{plan.aiReason}</p>
                              </div>
                          </div>
                        </DialogContent>
                       </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                       {plan.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(plan.id, 'approved')}
                          disabled={isUpdating && updatingPlanId === plan.id}
                          className="mr-2"
                        >
                          {isUpdating && updatingPlanId === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-500" />}
                        </Button>
                       )}
                      {plan.status !== 'denied' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(plan.id, 'denied')}
                          disabled={isUpdating && updatingPlanId === plan.id}
                        >
                           {isUpdating && updatingPlanId === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 text-red-500" />}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
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
