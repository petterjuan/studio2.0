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

  const { name, email } = validatedFields.data;

  try {
    // This action no longer creates the Auth user. It only validates data
    // and creates the Firestore document after client-side creation.
    // We get the user by email to find the UID.
    const userRecord = await adminAuth.getUserByEmail(email);

    // Create the user document in Firestore.
    await adminFirestore.collection("users").doc(userRecord.uid).set({
        name: name,
        email: email,
        createdAt: new Date(),
        isAdmin: false, // Default role
    }, { merge: true }); // Use merge to avoid overwriting if it somehow already exists

    return { message: '¡Registro exitoso! Bienvenido.', success: true };
  } catch (error: any) {
    console.error('Error de registro en la acción del servidor:', error);
    // This error is more likely to be a Firestore or lookup error now.
    let message = 'No se pudo guardar la información del usuario.';
    if (error.code === 'auth/user-not-found') {
        message = 'El usuario no pudo ser encontrado después de la creación. Por favor, contacta a soporte.'
    }
    return { message, success: false };
  }
}
