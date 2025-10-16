
'use server';

import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce una dirección de correo electrónico válida." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type LoginState = {
  message: string;
  success: boolean;
};

// This server action is now only responsible for validating the form fields.
// The actual authentication is handled on the client-side for security and to establish a session.
export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = errors.email?.[0] || errors.password?.[0] || 'Campos inválidos.';
    return {
      message: `Error de validación: ${errorMessage}`,
      success: false,
    };
  }

  // The client has already handled authentication. We just confirm validation was successful.
  return { message: 'Validación exitosa.', success: true };
}
