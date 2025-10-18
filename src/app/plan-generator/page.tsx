'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Save, CheckCircle, BrainCircuit } from 'lucide-react';
import { WorkoutPlanGeneratorInput, generateWorkoutPlan } from '@/ai/flows/workout-plan-generator';
import type { WorkoutPlan } from '@/lib/definitions';
import { useAuth } from '@/firebase/auth-provider';
import { saveWorkoutPlan } from './actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  objective: z.enum(['fat_loss', 'muscle_gain', 'maintenance'], {
    required_error: 'Debes seleccionar un objetivo.',
  }),
  experience: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Debes seleccionar tu nivel de experiencia.',
  }),
  daysPerWeek: z.coerce.number().int().min(2).max(6),
  preferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PlanGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [isSaved, setIsSaved] = useState(false);
   const [lastSubmittedData, setLastSubmittedData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      daysPerWeek: 3,
      preferences: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedPlan(null); // Clear previous plan immediately
    setIsSaved(false);
    setLastSubmittedData(values);

    const input: WorkoutPlanGeneratorInput = {
      ...values,
      daysPerWeek: values.daysPerWeek, // Pass as a number
    };

    try {
      const plan = await generateWorkoutPlan(input);
      setGeneratedPlan(plan);
    } catch (error) {
      console.error('Error generando el plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error al generar el plan',
        description: 'Hubo un problema con nuestro sistema. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSavePlan() {
    if (!generatedPlan || !user || !lastSubmittedData) {
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'No hay ningún plan para guardar, no has iniciado sesión, o no hay datos de formulario.',
      });
      return;
    }
    setIsSaving(true);

    const userInput = {
        objective: lastSubmittedData.objective,
        experience: lastSubmittedData.experience,
        daysPerWeek: String(lastSubmittedData.daysPerWeek), // Convert to string for Firestore consistency
        preferences: lastSubmittedData.preferences || ''
    };

    try {
      await saveWorkoutPlan(user.uid, generatedPlan, userInput);
      setIsSaved(true);
      toast({
        title: '¡Plan guardado!',
        description: 'Puedes ver tu plan en tu panel de control.',
        action: (
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Ver Dashboard
            </Button>
          </Link>
        ),
      });
    } catch (error) {
      console.error('Error al guardar el plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'Hubo un problema al guardar tu plan. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline flex items-center justify-center gap-4">
          <BrainCircuit className="w-10 h-10 text-primary" />
          <span>Tu Motor de Planes Personalizados</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Responde unas pocas preguntas y deja que nuestro sistema, entrenado por Valentina Montero, cree un plan de entrenamiento único solo para ti.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle as="h2">Crea Tu Plan Personalizado</CardTitle>
            <CardDescription>Completa el formulario para que el sistema diseñe tu rutina.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold text-base">1. ¿Cuál es tu objetivo principal?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="fat_loss" /></FormControl>
                            <FormLabel className="font-normal">Quemar Grasa y Definir</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="muscle_gain" /></FormControl>
                            <FormLabel className="font-normal">Ganar Masa Muscular</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="maintenance" /></FormControl>
                            <FormLabel className="font-normal">Mantener mi Físico Actual</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold text-base">2. ¿Cuál es tu nivel de experiencia?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="beginner" /></FormControl>
                            <FormLabel className="font-normal">Principiante (0-1 año entrenando)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="intermediate" /></FormControl>
                            <FormLabel className="font-normal">Intermedia (1-3 años entrenando)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="advanced" /></FormControl>
                            <FormLabel className="font-normal">Avanzada (3+ años entrenando)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daysPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">3. ¿Cuántos días a la semana quieres entrenar?</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona los días" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[2, 3, 4, 5, 6].map(day => (
                            <SelectItem key={day} value={String(day)}>{day} días</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">4. Preferencias (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Prefiero ejercicios con peso corporal, tengo una lesión en la rodilla, quiero enfocarme en glúteos, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generando Plan...</>
                  ) : (
                    <><Sparkles className="mr-2 h-5 w-5" /> Generar Mi Plan de Entrenamiento</>
                  )}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        <div className="bg-muted/50 rounded-lg p-6 lg:p-8 flex flex-col h-full">
          <h3 className="text-2xl font-headline mb-4">Tu Plan Generado</h3>
          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Nuestro sistema está creando tu rutina. ¡Un momento!</p>
            </div>
          ) : generatedPlan ? (
            <div className="flex-grow flex flex-col">
              <Card className="flex-grow">
                <CardHeader>
                  <CardTitle as="h3">{generatedPlan.title}</CardTitle>
                  <CardDescription>{generatedPlan.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedPlan.weeklySchedule.map((dayPlan, index) => (
                    <div key={index} className="p-3 bg-background rounded-md border">
                      <p className="font-bold">{dayPlan.day}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{dayPlan.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {user ? (
                <Button onClick={handleSavePlan} disabled={isSaving || isSaved} className="w-full mt-4" size="lg">
                  {isSaving ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...</>
                  ) : isSaved ? (
                    <><CheckCircle className="mr-2 h-5 w-5" /> ¡Guardado!</>
                  ) : (
                    <><Save className="mr-2 h-5 w-5" /> Guardar Plan en mi Perfil</>
                  )}
                </Button>
              ) : (
                 <Card className="mt-4 text-center p-4">
                    <CardHeader>
                      <CardTitle as="h3">Guarda Tu Progreso</CardTitle>
                      <CardDescription>
                          Crea una cuenta o inicia sesión para guardar este plan y acceder a él en cualquier momento.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-2">
                        <Button asChild className="flex-1">
                          <Link href="/signup">Crear Cuenta</Link>
                        </Button>
                        <Button asChild variant="secondary" className="flex-1">
                          <Link href="/login">Iniciar Sesión</Link>
                        </Button>
                    </CardContent>
                 </Card>
               )}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-center">
              <p className="text-muted-foreground">Tu plan de entrenamiento personalizado aparecerá aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

    