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
  fitnessGoals: z.string().min(10, { message: 'Please describe your goals in more detail.' }),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableEquipment: z.string().min(5, { message: 'Please list your available equipment.' }),
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
      availableEquipment: 'Bodyweight only',
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
                            <FormLabel>Fitness Goals</FormLabel>
                            <FormControl>
                            <Textarea placeholder="e.g., I want to lose 10 pounds and build lean muscle, focusing on my core and upper body." {...field} />
                            </FormControl>
                            <FormDescription>Describe what you want to achieve.</FormDescription>
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
                            <FormLabel>Experience Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your experience" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
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
                            <FormLabel>Available Equipment</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Dumbbells, resistance bands" {...field} />
                            </FormControl>
                             <FormDescription>List what you have access to.</FormDescription>
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
                                <FormLabel>Workout Duration (minutes)</FormLabel>
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
                                <FormLabel>Workouts per Week</FormLabel>
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
                        Generate Plan
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-card rounded-lg">
                <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-headline">Crafting your perfect plan...</h3>
                <p className="text-muted-foreground">Our AI is analyzing your goals to create a personalized routine.</p>
            </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {generatedPlan && (
            <>
                <WorkoutPlanDisplay plan={generatedPlan} />
                <div className="text-center mt-8">
                    <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Another Plan
                    </Button>
                </div>
            </>
        )}
    </div>
  );
}
