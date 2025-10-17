'use client';

import { useActionState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from './actions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClientLoading, startClientTransition] = useTransition();
  
  const [state, formAction] = useActionState(login, { message: '', success: false });

  useEffect(() => {
    if (state.success) {
      toast({ title: '¡Éxito!', description: 'Has iniciado sesión correctamente.' });
      router.push('/dashboard');
    } else if (state.message && state.message.startsWith('Error de validación')) {
        // Only show toast for validation errors from the server action
      toast({ 
        variant: 'destructive', 
        title: 'Error de validación', 
        description: state.message 
      });
    }
  }, [state, router, toast]);

  const handleClientAuth = (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        toast({ variant: 'destructive', title: 'Error', description: "Por favor completa todos los campos." });
        return;
    }

    startClientTransition(async () => {
        try {
            // Step 1: Sign in on the client to establish a session
            await signInWithEmailAndPassword(auth, email, password);

            // Step 2: Call the server action for validation (optional, but good practice)
            formAction(formData);

        } catch (error: any) {
            let message = 'Ocurrió un error desconocido.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = 'El correo electrónico o la contraseña son incorrectos.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Por favor, introduce una dirección de correo electrónico válida.';
            }
            toast({ variant: 'destructive', title: 'Error de inicio de sesión', description: message });
        }
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <CardTitle as="h1" className="text-2xl font-headline">Bienvenido de Nuevo</CardTitle>
        <CardDescription as="p">Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <form action={handleClientAuth}>
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
          <SubmitButton isClientLoading={isClientLoading} loadingText="Iniciando sesión...">
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
