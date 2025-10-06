'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/client';

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters."}),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
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
    const errorMessage = errors.name?.[0] || errors.email?.[0] || errors.password?.[0] || 'Invalid fields.';
    return {
      message: errorMessage,
      success: false,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(firestore, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
        isAdmin: false, // Default role
    });

    return { message: 'Signup successful! Welcome.', success: true };
  } catch (error: any) {
    console.error('Signup error:', error.code);
    let message = 'An unknown error occurred.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'This email is already registered.';
    } else {
      message = 'Failed to create an account. Please try again later.';
    }
    return { message, success: false };
  }
}
