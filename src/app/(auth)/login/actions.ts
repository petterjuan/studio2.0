'use server';

import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: "Dirección de correo electrónico inválida." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type LoginState = {
  message: string;
  success: boolean;
};

// This server action is now only responsible for validating the form data shape.
// The actual sign-in logic is handled on the client-side with Firebase SDK,
// which is the standard and recommended approach.
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

  // Validation successful. The client can now proceed with the sign-in attempt.
  return { message: 'Validación exitosa. Procediendo al inicio de sesión.', success: true };
}
