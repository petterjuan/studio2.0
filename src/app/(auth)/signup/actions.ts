'use server';

import { z } from 'zod';
import { firestore as adminFirestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getCurrentUser } from '@/firebase/server';

const SignupSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres."}),
  email: z.string().email({ message: "Por favor, introduce una dirección de correo electrónico válida." }),
});

type SignupState = {
  message: string;
  success: boolean;
};

// This action no longer accepts a UID from the client.
// It securely gets the user from the server-side session.
export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = errors.name?.[0] || errors.email?.[0] || 'Campos inválidos.';
    return {
      message: errorMessage,
      success: false,
    };
  }

  try {
    // Securely get the authenticated user from the server session.
    const user = await getCurrentUser();
    if (!user) {
        return { message: "Usuario no autenticado. No se pudo crear el perfil.", success: false };
    }

    const { name, email } = validatedFields.data;

    // Create the user document in Firestore with the server-verified UID.
    await adminFirestore.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        createdAt: FieldValue.serverTimestamp(),
        isAdmin: false,
    });

    return { message: '¡Registro exitoso! Bienvenido.', success: true };
  } catch (error: any) {
    console.error('Error creando el documento de usuario en Firestore:', error);
    let message = 'No se pudo guardar la información del perfil de usuario.';
    if (error.code === 'auth/id-token-expired') {
        message = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
    }
    return { message, success: false };
  }
}
