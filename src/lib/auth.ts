'use server';

import { firestore } from "@/firebase/server";

export async function isAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) {
    return false;
  }

  try {
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data()?.isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
