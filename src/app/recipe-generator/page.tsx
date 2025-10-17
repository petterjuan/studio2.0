
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
      if (!recipe.isValidIngredient) {
        toast({
            variant: 'destructive',
            title: 'Ingrediente Inválido',
            description: recipe.error || 'Por favor, introduce un ingrediente válido.',
        });
        setGeneratedRecipe(null);
      } else {
        setGeneratedRecipe(recipe);
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Error al Generar la Receta',
        description: 'Hubo un problema con nuestro sistema. Por favor, intenta de nuevo.',
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
          <span>Generador de Recetas con IA</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Dinos qué tienes a mano, y nuestra IA creará una receta deliciosa y saludable para ti.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle as="h2">Crea Tu Receta</CardTitle>
            <CardDescription>Completa el formulario para diseñar tu comida.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="ingredient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-base">Ingrediente Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Aguacate, Pollo, Lentejas" {...field} />
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
                      <FormLabel className="font-bold text-base">Restricciones Dietéticas (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Vegetariano, Sin gluten" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generando Receta...</>
                  ) : (
                    <><Sparkles className="mr-2 h-5 w-5" /> Generar Mi Receta</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="bg-muted/50 rounded-lg p-6 lg:p-8 flex flex-col h-full">
          <h3 className="text-2xl font-headline mb-4">Tu Receta Generada</h3>
          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Nuestro chef de IA está preparando tu receta...</p>
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
                        <span>Cocción: {generatedRecipe.cookTime}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Porciones: {generatedRecipe.servings}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Ingredientes</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {generatedRecipe.ingredients?.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Instrucciones</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      {generatedRecipe.instructions?.map((item, index) => <li key={index}>{item}</li>)}
                    </ol>
                  </div>
                  {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-2">Consejos</h4>
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
              <p className="text-muted-foreground">Tu deliciosa receta aparecerá aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
