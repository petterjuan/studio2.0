
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { handleGenerateWorkout } from './actions';
import { GenerateCustomWorkoutPlanOutput } from '@/ai/flows/generate-custom-workout-plan';
import WorkoutPlanDisplay from './workout-plan-display';
import { Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  fitnessGoals: z.string().min(10, { message: 'Por favor, describe tus objetivos con más detalle.' }),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableEquipment: z.string().min(5, { message: 'Por favor, enumera el equipo que tienes disponible.' }),
  workoutDuration: z.coerce.number().min(15).max(120),
  workoutFrequency: z.coerce.number().min(1).max(7),
});

type FormValues = z.infer<typeof formSchema>;

const loadingSteps = [
    "Analizando tus objetivos...",
    "Diseñando tus rutinas...",
    "Personalizando los ejercicios...",
    "Compilando tu plan...",
    "¡Casi listo!"
];

export default function WorkoutGeneratorForm() {
  const [generatedPlan, setGeneratedPlan] = useState<GenerateCustomWorkoutPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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
    setLoadingStep(0);
    
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fitnessGoals"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg font-semibold">Tus Metas de Fitness</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Ej: Quiero perder 10 kilos y construir músculo magro, enfocándome en mi core y tren superior." {...field} rows={3} />
                        </FormControl>
                        <FormDescription>Describe lo que quieres lograr con el mayor detalle posible.</FormDescription>
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
                            </Trigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="beginner">Principiante (0-1 años)</SelectItem>
                            <SelectItem value="intermediate">Intermedio (1-3 años)</SelectItem>
                            <SelectItem value="advanced">Avanzado (3+ años)</SelectItem>
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
                            <FormDescription>¿Cuánto tiempo tienes para cada sesión?</FormDescription>
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
                            <FormDescription>¿Cuántos días puedes comprometerte?</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generar Mi Plan Personalizado
                </Button>
                </form>
            </Form>
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-12 min-h-[300px]">
                 <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1,
                        ease: "easeInOut",
                    }}
                >
                    <Wand2 className="h-16 w-16 text-primary mb-6" />
                </motion.div>
                <h3 className="text-2xl font-headline mb-4">Creando tu plan perfecto...</h3>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={loadingStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-muted-foreground"
                    >
                        {loadingSteps[loadingStep]}
                    </motion.p>
                </AnimatePresence>
            </div>
        )}

        {error && (
             <div className="min-h-[300px] flex flex-col justify-center items-center">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertTitle>Falló la Generación del Plan</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button variant="outline" onClick={() => { setError(null); form.reset(); }} className="mt-6">
                    Intentar de Nuevo
                </Button>
            </div>
        )}

        {generatedPlan && (
            <>
                <WorkoutPlanDisplay plan={generatedPlan} />
                <div className="text-center mt-8">
                    <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Crear un Plan Diferente
                    </Button>
                </div>
            </>
        )}
    </div>
  );
}

    