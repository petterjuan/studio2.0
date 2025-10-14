'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup } from './actions';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClientLoading, startClientTransition] = useTransition();

  const handleFormSubmit = (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        toast({ variant: 'destructive', title: 'Error de registro', description: "Por favor completa todos los campos." });
        return;
    }

    startClientTransition(async () => {
      try {
        // Step 1: Create user on the client for immediate sign-in
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Step 2: Update the user's profile with their name
        await updateProfile(user, { displayName: name });

        // Step 3: Call the server action to create the Firestore document, passing the new UID
        const serverResult = await signup(user.uid, formData);

        if (serverResult.success) {
          toast({ title: '¡Bienvenido!', description: 'Tu cuenta ha sido creada exitosamente.' });
          router.push('/dashboard');
        } else {
           toast({ variant: 'destructive', title: 'Error de registro', description: serverResult.message });
        }
      } catch (error: any) {
        let message = 'Ocurrió un error desconocido.';
        if (error.code === 'auth/email-already-in-use') {
          message = 'Este correo electrónico ya está registrado.';
        } else if (error.code === 'auth/weak-password') {
            message = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.'
        }
        toast({ variant: 'destructive', title: 'Error de registro', description: message });
      }
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Crear una Cuenta</CardTitle>
        <CardDescription>Únete a VM Fitness Hub para comenzar tu viaje.</CardDescription>
      </CardHeader>
      <form action={handleFormSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" placeholder="Valentina Montero" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" name="email" type="email" placeholder="m@ejemplo.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton isClientLoading={isClientLoading} loadingText="Creando Cuenta...">
            Crear Cuenta
          </SubmitButton>
          <div className="text-sm text-center text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Iniciar Sesión
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
