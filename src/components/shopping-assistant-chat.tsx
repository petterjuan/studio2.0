'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, CornerDownLeft, X, Loader, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { shoppingAssistant, ShoppingAssistantInput } from '@/ai/flows/shopping-assistant';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ShoppingAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isOpen && messages.length === 0 && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
            setMessages([
                { role: 'assistant', content: `¡Hola, campeona! Soy la asistente de Valentina. ¿Cuáles son tus metas de fitness? Cuéntame un poco para poder guiarte hacia el plan de coaching o el producto perfecto para ti.` },
            ]);
            setIsLoading(false);
        }, 1000)
    }
  }, [isOpen, messages.length, isLoading]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Short delay to ensure the input is rendered
    }
  }, [isOpen]);
  

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        const assistantInput: ShoppingAssistantInput = {
            query: input,
            history: messages, // Send the history *before* the new user message
        };
        const result = await shoppingAssistant(assistantInput);
        const assistantMessage: Message = { role: 'assistant', content: result.response };
        setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
        console.error("Error al llamar al asistente de compras:", error);
        const errorMessage: Message = { role: 'assistant', content: "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo más tarde." };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full h-16 w-16 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
          <span className="sr-only">Abrir Asistente</span>
        </Button>
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
                  <CardTitle className="text-lg font-headline">Asistente de Valentina</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {isLoading && messages.length === 0 && (
                        <div className="flex items-start gap-3">
                            <AvatarIcon className="bg-primary text-primary-foreground" />
                            <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted flex items-center">
                                <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
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
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        {message.role === 'user' && <User className="h-8 w-8 rounded-full p-1 bg-muted text-muted-foreground" />}
                      </div>
                    ))}
                    {isLoading && messages.length > 0 && (
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
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${className}`}>
      <Bot className="h-5 w-5" />
    </div>
  );
}
