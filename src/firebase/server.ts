import * as admin from 'firebase-admin';

let firestore: admin.firestore.Firestore;

const hasFirebaseCredentials =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (hasFirebaseCredentials && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

if (admin.apps.length) {
  firestore = admin.firestore();
} else {
  // Provide dummy objects if Firebase is not initialized
  firestore = {} as admin.firestore.Firestore;
  if (process.env.NODE_ENV !== 'development') {
    console.warn("Firebase Admin SDK not initialized. Functionality will be limited.");
  }
}

export { firestore };
