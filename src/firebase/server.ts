import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { cache } from 'react';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let app: App;

if (getApps().length === 0) {
  if (serviceAccountKey) {
    const serviceAccount = JSON.parse(serviceAccountKey);
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    // This is for local development without service account key
    // It will use Application Default Credentials
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const firestore = getFirestore(app);

export const getCurrentUser = cache(async () => {
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await firestore.collection('users').doc(decodedIdToken.uid).get();
    const isAdmin = userDoc.exists && userDoc.data()?.isAdmin === true;
    
    return { ...decodedIdToken, isAdmin };

  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
});


export { app, auth, firestore };
