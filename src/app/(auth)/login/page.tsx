'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from './actions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubmitButton } from '@/components/submit-button';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [state, formAction, isPending] = useActionState(login, { message: '', success: false });

  useEffect(() => {
    if (state.success) {
      toast({ title: '¡Éxito!', description: 'Has iniciado sesión correctamente.' });
      router.push('/dashboard');
    } else if (state.message) {
      const isValidationError = state.message.includes('válida') || state.message.includes('caracteres');
      toast({ 
        variant: 'destructive', 
        title: isValidationError ? 'Error de validación' : 'Error de inicio de sesión', 
        description: state.message 
      });
    }
  }, [state, router, toast]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <CardTitle as="h1" className="text-2xl font-headline">Bienvenido de Nuevo</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" name="email" type="email" placeholder="m@ejemplo.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton isClientLoading={isPending} loadingText="Iniciando sesión...">
            Iniciar Sesión
          </SubmitButton>
          <div className="text-sm text-center text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="underline hover:text-primary">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
