'use server';

import { z } from 'zod';
import { firestore as adminFirestore } from '@/firebase/server';

const SignupSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres."}),
  email: z.string().email({ message: "Por favor, introduce una dirección de correo electrónico válida." }),
});

type SignupState = {
  message: string;
  success: boolean;
};

// Note: This action expects the user to have been created on the client-side first.
// It receives the UID to create the corresponding Firestore document.
export async function signup(uid: string, formData: FormData): Promise<SignupState> {
    if (!uid) {
        return { message: "ID de usuario no proporcionado. No se pudo crear el perfil.", success: false };
    }

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

  const { name, email } = validatedFields.data;

  try {
    // Create the user document in Firestore with the UID from client-side auth.
    await adminFirestore.collection("users").doc(uid).set({
        name: name,
        email: email,
        createdAt: new Date(),
        isAdmin: false, // Default role
    });

    return { message: '¡Registro exitoso! Bienvenido.', success: true };
  } catch (error: any) {
    console.error('Error creando el documento de usuario en Firestore:', error);
    return { message: 'No se pudo guardar la información del perfil de usuario.', success: false };
  }
}
