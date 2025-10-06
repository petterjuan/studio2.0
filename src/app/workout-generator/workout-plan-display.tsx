'use client';
import { WorkoutPlan } from '@/lib/definitions';
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

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan;
}

export default function WorkoutPlanDisplay({ plan }: WorkoutPlanDisplayProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user) {
            toast({
                title: 'Login Required',
                description: 'Please log in to save your workout plan.',
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        try {
            await saveWorkoutPlan(plan, user.uid);
            toast({
                title: 'Plan Saved!',
                description: 'Your workout plan has been saved to your dashboard.',
            });
        } catch (error) {
            toast({
                title: 'Error Saving Plan',
                description: 'Could not save the workout plan. Please try again.',
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
                {isSaving ? 'Saving...' : 'Save Plan'}
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
                    <TableHead className="w-[40%]">Exercise</TableHead>
                    <TableHead>Sets</TableHead>
                    <TableHead>Reps</TableHead>
                    <TableHead>Rest</TableHead>
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
