
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, CornerDownLeft, X, Loader, MessagesSquare, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { shoppingAssistant, ShoppingAssistantInput } from '@/ai/flows/shopping-assistant';
import type { WorkoutPlan, WorkoutPlanGeneratorInputData } from '@/lib/definitions';
import { useAuth } from '@/firebase/auth-provider';
import { saveWorkoutPlan } from '@/app/plan-generator/actions'; // Re-use the save action
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type Message = {
  role: 'user' | 'assistant';
  content: string;
  plan?: WorkoutPlan;
  userInput?: WorkoutPlanGeneratorInputData;
};

export default function ShoppingAssistantChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);


  // Show welcome message only when the chat is opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setIsLoading(true);
        setTimeout(() => {
            setMessages([
                { role: 'assistant', content: `¡Hola, campeona! Soy la asistente de Valentina. ¿Cuáles son tus metas de fitness? Cuéntame un poco para poder guiarte hacia el plan de coaching o el producto perfecto para ti.` },
            ]);
            setIsLoading(false);
        }, 1000)
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-focus the input when the chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Short delay to ensure the input is rendered
    }
  }, [isOpen]);
  
  async function handleSavePlan(plan: WorkoutPlan | undefined, userInput: WorkoutPlanGeneratorInputData | undefined) {
    if (!plan || !user || !userInput) {
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'No hay plan para guardar, no has iniciado sesión o faltan datos de entrada.',
      });
      return;
    }
    setIsSaving(true);
    
    try {
      await saveWorkoutPlan(user.uid, plan, userInput);
      setIsSaved(true);
      toast({
        title: '¡Plan guardado!',
        description: 'Puedes ver tu plan en tu panel de control.',
      });
    } catch (error) {
      console.error('Error al guardar el plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'Hubo un problema al guardar tu plan.',
      });
    } finally {
      setIsSaving(false);
    }
  }


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const assistantInput: ShoppingAssistantInput = {
            query: input,
            history: messages.map(m => ({role: m.role, content: m.content})), // Don't send the plan object
        };
        const result = await shoppingAssistant(assistantInput);
        const assistantMessage: Message = { 
            role: 'assistant', 
            content: result.response, 
            plan: result.generatedPlan,
            userInput: result.userInput
        };
        setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
        console.error("Error llamando al asistente de compras:", error);
        const errorMessage: Message = { role: 'assistant', content: "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo más tarde." };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="w-[350px] h-[500px] shadow-2xl flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-primary" />
                  <CardTitle as="h2" className="text-lg font-headline">Asistente de Compras</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${
                          message.role === 'user' ? 'justify-end' : ''
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <AvatarIcon className="bg-primary text-primary-foreground" />
                        )}
                        <div className="flex flex-col gap-2 w-full">
                          <div
                            className={`rounded-lg px-4 py-2 max-w-[85%] text-sm ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground self-end'
                                : 'bg-muted self-start'
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                           {message.plan && (
                                <Card className="bg-muted self-start max-w-[85%]">
                                    <CardHeader className="pb-2">
                                        <CardTitle as="h4" className="text-base">{message.plan.title}</CardTitle>
                                        <CardDescription className="text-xs">{message.plan.summary}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            onClick={() => handleSavePlan(message.plan, message.userInput)}
                                            disabled={isSaving || isSaved || !user}
                                            className="w-full"
                                            size="sm"
                                        >
                                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isSaved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                            {isSaved ? '¡Guardado!' : 'Guardar Plan'}
                                        </Button>
                                        {!user && <p className="text-xs text-muted-foreground text-center mt-2">Inicia sesión para guardar.</p>}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        {message.role === 'user' && <User className="h-8 w-8 rounded-full p-1 bg-muted text-muted-foreground" />}
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3">
                         <AvatarIcon className="bg-primary text-primary-foreground" />
                         <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted flex items-center">
                            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                         </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                  <Input
                    ref={inputRef}
                    id="message"
                    placeholder="Describe tus metas..."
                    className="flex-1"
                    autoComplete="off"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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

function AvatarIcon({ className }: { className?: string }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${className}`}>
      <Bot className="h-5 w-5" />
    </div>
  );
}
