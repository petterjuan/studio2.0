'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { handleGenerateWorkout } from './actions';
import { WorkoutPlan } from '@/lib/definitions';
import WorkoutPlanDisplay from './workout-plan-display';
import { Loader, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  fitnessGoals: z.string().min(10, { message: 'Por favor, describe tus objetivos con más detalle.' }),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableEquipment: z.string().min(5, { message: 'Por favor, enumera el equipo que tienes disponible.' }),
  workoutDuration: z.coerce.number().min(15).max(120),
  workoutFrequency: z.coerce.number().min(1).max(7),
});

type FormValues = z.infer<typeof formSchema>;

export default function WorkoutGeneratorForm() {
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessGoals: '',
      experienceLevel: 'beginner',
      availableEquipment: 'Solo peso corporal',
      workoutDuration: 45,
      workoutFrequency: 3,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedPlan(null);
    setError(null);
    
    const result = await handleGenerateWorkout(values);
    
    if(result.plan) {
        setGeneratedPlan(result.plan);
    } else {
        setError(result.error);
    }

    setIsLoading(false);
  }

  return (
    <div className="w-full">
        {!generatedPlan && !isLoading && (
            <Card>
                <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="fitnessGoals"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metas de Fitness</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Ej: Quiero perder 10 kilos y construir músculo magro, enfocándome en mi core y tren superior." {...field} />
                            </FormControl>
                            <FormDescription>Describe lo que quieres lograr.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nivel de Experiencia</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu experiencia" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="beginner">Principiante</SelectItem>
                                <SelectItem value="intermediate">Intermedio</SelectItem>
                                <SelectItem value="advanced">Avanzado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="availableEquipment"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Equipamiento Disponible</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Mancuernas, bandas de resistencia" {...field} />
                            </FormControl>
                             <FormDescription>Enumera a qué tienes acceso.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="workoutDuration"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Duración del Entrenamiento (minutos)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="workoutFrequency"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Entrenamientos por Semana</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generar Plan
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-card rounded-lg">
                <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-headline">Creando tu plan perfecto...</h3>
                <p className="text-muted-foreground">Nuestro sistema está analizando tus metas para crear una rutina personalizada.</p>
            </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Falló la Generación</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {generatedPlan && (
            <>
                <WorkoutPlanDisplay plan={generatedPlan} />
                <div className="text-center mt-8">
                    <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generar Otro Plan
                    </Button>
                </div>
            </>
        )}
    </div>
  );
}
