'use server';

import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginState = {
  message: string;
  success: boolean;
};

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0] || 'Invalid fields.',
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { message: 'Login successful!', success: true };
  } catch (error: any) {
    console.error('Login error:', error.code);
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
    return { message, success: false };
  }
}
