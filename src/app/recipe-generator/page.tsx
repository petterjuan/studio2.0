
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, ChefHat, Utensils, Clock, Users } from 'lucide-react';
import { RecipeInputSchema, RecipeInput, Recipe, generateRecipe } from '@/ai/flows/recipe-generator';
import { useToast } from '@/hooks/use-toast';

type FormValues = RecipeInput;

export default function RecipeGeneratorPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(RecipeInputSchema),
    defaultValues: {
      ingredient: '',
      dietaryRestrictions: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedRecipe(null);

    try {
      const recipe = await generateRecipe(values);
      setGeneratedRecipe(recipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Error generating recipe',
        description: 'There was a problem with our system. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline flex items-center justify-center gap-4">
          <ChefHat className="w-10 h-10 text-primary" />
          <span>AI Recipe Generator</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Tell us what you have, and our AI will create a delicious recipe for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle as="h2">Create Your Recipe</CardTitle>
            <CardDescription>Fill out the form to design your meal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="ingredient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Main Ingredient</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Avocado, Chicken, Lentils" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Dietary Restrictions (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vegetarian, Gluten-free" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Recipe...</>
                  ) : (
                    <><Sparkles className="mr-2 h-5 w-5" /> Generate My Recipe</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="bg-muted/50 rounded-lg p-6 lg:p-8 flex flex-col h-full">
          <h3 className="text-2xl font-headline mb-4">Your Generated Recipe</h3>
          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Our AI chef is cooking up your recipe...</p>
            </div>
          ) : generatedRecipe ? (
            <div className="flex-grow flex flex-col">
              <Card className="flex-grow">
                <CardHeader>
                  <CardTitle as="h3">{generatedRecipe.title}</CardTitle>
                  <CardDescription>{generatedRecipe.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-around text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Prep: {generatedRecipe.prepTime}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        <span>Cook: {generatedRecipe.cookTime}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Serves: {generatedRecipe.servings}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {generatedRecipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      {generatedRecipe.instructions.map((item, index) => <li key={index}>{item}</li>)}
                    </ol>
                  </div>
                  {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-2">Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {generatedRecipe.tips.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-center">
              <p className="text-muted-foreground">Your delicious recipe will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
