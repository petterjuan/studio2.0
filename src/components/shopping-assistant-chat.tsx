'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, CornerDownLeft, X, Loader, MessagesSquare, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { shoppingAssistantFlow } from '@/ai/flows/shopping-assistant';
import type { WorkoutPlanGeneratorInput, WorkoutPlanGeneratorOutput, ShoppingAssistantInput, ShoppingAssistantOutput, WorkoutPlanGeneratorInputData } from '@/lib/definitions';
import { useAuth } from '@/firebase/auth-provider';
import { saveWorkoutPlan } from '@/app/plan-generator/actions';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


type Message = {
  role: 'user' | 'assistant';
  content: string;
  plan?: WorkoutPlanGeneratorOutput;
  userInput?: WorkoutPlanGeneratorInput;
};

export default function SalesOptimizedChat() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // === Auto-focus input when chat opens ===
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // === Auto-scroll to bottom ===
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [messages, isLoading]);

  // === Welcome message ===
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages([{
          role: 'assistant',
          content: '¡Hola! Soy Valentina, tu asistente de fitness. Cuéntame tus metas y puedo generar un plan de entrenamiento personalizado que realmente funcione para ti.',
        }]);
        setIsLoading(false);
      }, 700);
    }
  }, [isOpen, messages.length]);

  // === Send Message / Trigger AI Flow ===
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/workout-plan', {
        method: 'POST',
        body: JSON.stringify({ query: input, history: messages }),
      });
      const result: ShoppingAssistantOutput = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
        plan: result.generatedPlan ?? undefined,        // ensures TS knows this can be undefined
        userInput: result.userInput ?? undefined,       // ensures TS knows this can be undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, algo salió mal. Por favor intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // === Save Plan ===
  const handleSavePlan = async (plan?: WorkoutPlanGeneratorOutput, userInput?: WorkoutPlanGeneratorInput) => {
    if (!plan || !user || !userInput) {
      toast({ variant: 'destructive', title: 'Error', description: 'No hay plan para guardar o no has iniciado sesión.' });
      return;
    }
    setIsSaving(true);
    try {
      await saveWorkoutPlan(user.uid, plan, userInput);
      setIsSaved(true);
      toast({ title: '¡Plan guardado!', description: 'Puedes verlo en tu panel de control.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error al guardar', description: 'Intenta de nuevo más tarde.' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full h-16 w-16 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                onClick={toggleChat}
              >
                {isOpen ? <X className="h-8 w-8" /> : <MessagesSquare className="h-8 w-8" />}
                <span className="sr-only">Abrir Asistente</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-primary text-primary-foreground">
              <p>¿Necesitas ayuda? ¡Pregúntame!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="w-[360px] h-[520px] shadow-2xl flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-primary" />
                  <CardTitle as="h2" className="text-lg font-headline">Asistente de Fitness</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && <AvatarIcon />}
                        <div className="flex flex-col gap-2 w-full">
                          <div className={`rounded-lg px-4 py-2 max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground self-end' : 'bg-muted self-start'}`}>
                            {msg.content}
                          </div>

                          {/* Render Plan Card */}
                          {msg.plan && (
                            <Card className="bg-muted self-start max-w-[85%]">
                              <CardHeader className="pb-2">
                                <CardTitle as="h3">{msg.plan.title}</CardTitle>
                                <CardDescription>{msg.plan.summary}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button
                                  onClick={() => handleSavePlan(msg.plan, msg.userInput)}
                                  disabled={isSaving || isSaved || !user}
                                  size="sm"
                                  className="w-full"
                                >
                                  {isSaving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : isSaved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                  {isSaved ? '¡Guardado!' : 'Guardar Plan'}
                                </Button>
                                {!user && <p className="text-xs text-muted-foreground text-center mt-2">Inicia sesión para guardar.</p>}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                        {msg.role === 'user' && <User className="h-8 w-8 rounded-full p-1 bg-muted text-muted-foreground" />}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <AvatarIcon />
                        <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted flex items-center">
                          <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter>
                <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Describe tus metas..."
                    className="flex-1"
                    autoComplete="off"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                    <CornerDownLeft className="h-4 w-4" />
                    <span className="sr-only">Enviar</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AvatarIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
      <Bot className="h-5 w-5" />
    </div>
  );
}
