import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Define a more specific type for the user object
interface CurrentUser extends DecodedIdToken {
  isAdmin: boolean;
}

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
let serviceAccount: object | undefined;

// Parse the service account key only once
if (serviceAccountKey) {
  try {
    serviceAccount = JSON.parse(serviceAccountKey);
  } catch (error) {
    console.error('Error parsing Firebase service account key:', error);
  }
}

let app: App;

if (getApps().length === 0) {
  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    // This is for local development without a service account key.
    // It uses Application Default Credentials.
    console.warn("Firebase service account key not found. Using Application Default Credentials. This is intended for local development only.");
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const firestore = getFirestore(app);

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return null;
  }
  
  try {
    const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await firestore.collection('users').doc(decodedIdToken.uid).get();
    const isAdmin = userDoc.exists && userDoc.data()?.isAdmin === true;
    
    return { ...decodedIdToken, isAdmin };

  } catch (error: any) {
    // Differentiate between expired cookie and other verification errors
    if (error.code === 'auth/session-cookie-expired') {
      console.log('Session cookie expired. User needs to log in again.');
    } else {
      console.error('Error verifying session cookie:', error);
    }
    return null;
  }
});


export { app, auth, firestore };
