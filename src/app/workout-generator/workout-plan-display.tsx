'use client';
import { GenerateCustomWorkoutPlanOutput } from '@/ai/flows/generate-custom-workout-plan';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { saveWorkoutPlan } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { WorkoutPlan } from '@/lib/definitions';

interface WorkoutPlanDisplayProps {
  plan: GenerateCustomWorkoutPlanOutput;
}

export default function WorkoutPlanDisplay({ plan }: WorkoutPlanDisplayProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user) {
            toast({
                title: 'Inicio de Sesión Requerido',
                description: 'Por favor, inicia sesión para guardar tu plan de entrenamiento.',
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        try {
            await saveWorkoutPlan(plan as WorkoutPlan, user.uid);
            toast({
                title: '¡Plan Guardado!',
                description: 'Tu plan de entrenamiento ha sido guardado en tu panel.',
            });
        } catch (error) {
            toast({
                title: 'Error al Guardar el Plan',
                description: 'No se pudo guardar el plan de entrenamiento. Por favor, inténtalo de nuevo.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };
  
    return (
    <div className="mt-12 w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline text-primary">{plan.title}</h2>
        <p className="mt-2 text-muted-foreground">{plan.summary}</p>
      </div>

      {user && (
        <div className="flex justify-end mb-4">
            <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Plan'}
            </Button>
        </div>
      )}

      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
        {plan.weeklySchedule.map((day, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg font-headline hover:no-underline">
              <div className="flex items-center gap-4">
                <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">{index + 1}</span>
                {day.day} - <span className="text-muted-foreground">{day.focus}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Ejercicio</TableHead>
                    <TableHead>Series</TableHead>
                    <TableHead>Repeticiones</TableHead>
                    <TableHead>Descanso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {day.exercises.map((exercise, exIndex) => (
                    <TableRow key={exIndex}>
                      <TableCell className="font-medium">{exercise.name}
                      {exercise.notes && <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>}
                      </TableCell>
                      <TableCell>{exercise.sets}</TableCell>
                      <TableCell>{exercise.reps}</TableCell>
                      <TableCell>{exercise.rest || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
