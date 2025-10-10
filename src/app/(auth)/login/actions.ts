'use server';

import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginState = {
  message: string;
  success: boolean;
};

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // This server action is responsible for validating the form data.
  // The actual sign-in logic is handled on the client-side, which is
  // the standard and more secure approach for Firebase Authentication.
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0] || 'Invalid fields.',
      success: false,
    };
  }

  // If validation is successful, the client-side will proceed with the sign-in attempt.
  return { message: 'Validation successful. Proceeding to login.', success: true };
}
