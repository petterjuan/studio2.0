'use server';

import { z } from 'zod';
import { auth as adminAuth, firestore as adminFirestore } from '@/firebase/server';

const SignupSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres."}),
  email: z.string().email({ message: "Dirección de correo electrónico inválida." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type SignupState = {
  message: string;
  success: boolean;
};

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = errors.name?.[0] || errors.email?.[0] || errors.password?.[0] || 'Campos inválidos.';
    return {
      message: errorMessage,
      success: false,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    try {
        await adminAuth.getUserByEmail(email);
        return { message: 'Este correo electrónico ya está registrado.', success: false };
    } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
            throw error; // Re-throw other errors
        }
        // If user not found, continue to create user.
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminFirestore.collection("users").doc(userRecord.uid).set({
        name: name,
        email: email,
        createdAt: new Date(),
        isAdmin: false, // Default role
    });

    return { message: '¡Registro exitoso! Bienvenido.', success: true };
  } catch (error: any) {
    console.error('Error de registro:', error.code);
    let message = 'Ocurrió un error desconocido.';
    if (error.code === 'auth/email-already-exists') {
      message = 'Este correo electrónico ya está registrado.';
    } else {
      message = 'No se pudo crear una cuenta. Por favor, inténtalo de nuevo más tarde.';
    }
    return { message, success: false };
  }
}
