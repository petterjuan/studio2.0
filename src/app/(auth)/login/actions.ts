'use server';

import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { app } from '@/firebase/server';

const LoginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce una dirección de correo electrónico válida." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type LoginState = {
  message: string;
  success: boolean;
};

// This server action now handles both validation and the sign-in attempt.
// However, since we cannot sign in a user from the server and create a session on the client,
// we will just validate the user exists. A more robust solution would involve a custom token.
// For this app's purpose, we'll simulate the check.
export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = errors.email?.[0] || errors.password?.[0] || 'Campos inválidos.';
    return {
      message: errorMessage,
      success: false,
    };
  }

  const { email } = validatedFields.data;

  try {
    const auth = getAuth(app);
    // This checks if a user with this email exists. It doesn't validate the password.
    // In a real app, you would not do this. You'd use the client SDK to sign in.
    // We are simplifying here to make the server action more complete.
    await auth.getUserByEmail(email);
    
    // We can't validate the password on the server securely without a custom flow,
    // so we will rely on the client to do the final sign in.
    // This action now primarily serves as a form validation and user existence check.
    return { message: 'Validación exitosa. Procediendo al inicio de sesión.', success: true };

  } catch (error: any) {
    let message = 'Error al iniciar sesión.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      message = 'El correo electrónico o la contraseña son incorrectos.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Por favor, introduce una dirección de correo electrónico válida.';
    }
    return { message, success: false };
  }
}
