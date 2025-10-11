'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern to initialize Firebase app only once
function initializeFirebase() {
  if (getApps().length > 0) {
    return getApp();
  }
  if (firebaseConfig.apiKey) {
    return initializeApp(firebaseConfig);
  }
  return null;
}

let app: FirebaseApp | null = null;
let auth: Auth;
let firestore: Firestore;

if (typeof window !== 'undefined') {
    app = initializeFirebase();
    if (app) {
        auth = getAuth(app);
        firestore = getFirestore(app);
    } else {
        // Mock the services if Firebase is not configured to avoid app crashes.
        auth = {} as Auth;
        firestore = {} as Firestore;
    }
} else {
    auth = {} as Auth;
    firestore = {} as Firestore;
}

export { app, auth, firestore };
