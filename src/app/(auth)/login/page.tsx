'use client';

import { useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { login } from './actions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando sesión...</> : 'Iniciar Sesión'}
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClientLoading, startClientTransition] = useTransition();

  // Server-side validation state
  const [state, formAction] = useActionState(login, { message: '', success: false });

  const handleFormSubmit = (formData: FormData) => {
    formAction(formData); // Perform server-side validation
  };

  useEffect(() => {
    // This effect handles the client-side sign-in attempt AFTER server validation succeeds.
    if (state.success && !isClientLoading) {
      const email = (document.getElementById('email') as HTMLInputElement)?.value;
      const password = (document.getElementById('password') as HTMLInputElement)?.value;
      
      if (!email || !password) return;
      
      startClientTransition(async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          router.push('/dashboard');
        } catch (error: any) {
           let message = 'An unknown error occurred.';
            switch (error.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/invalid-credential':
                message = 'Invalid email or password.';
                break;
              case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;
              default:
                message = 'Failed to log in. Please try again later.';
                break;
            }
          toast({ variant: 'destructive', title: 'Error de inicio de sesión', description: message });
        }
      });
    }
  }, [state.success, router, toast, isClientLoading]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Bienvenido de Nuevo</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <form action={handleFormSubmit}>
        <CardContent className="grid gap-4">
          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
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
          <SubmitButton />
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
